/**
 * POST /api/contact  (Vercel Node serverless function)
 * ---------------------------------------------------------------------------
 * Receives the contact form and emails it via Resend.
 *
 * Environment variables (set in the Vercel dashboard — never hardcode):
 *   RESEND_API_KEY     (required)  Your Resend API key.
 *   CONTACT_TO_EMAIL   (required)  Where enquiries are delivered.
 *   CONTACT_FROM_EMAIL (optional)  Verified sender, e.g. "Apex <hello@yourdomain.com>".
 *                                  Defaults to Resend's onboarding address for testing.
 *
 * Security/robustness: method guard, input validation, honeypot, and a
 * best-effort in-memory rate limiter.
 */

// --- Simple in-memory rate limiter (per warm instance; best-effort) --------
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const hits = new Map(); // ip -> number[] (timestamps)

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function getIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function readBody(req) {
  // Vercel usually parses JSON into req.body; handle string/stream too.
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") {
    try { return Promise.resolve(JSON.parse(req.body)); } catch { return Promise.resolve({}); }
  }
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch { resolve({}); } });
    req.on("error", () => resolve({}));
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(d) {
  const errors = {};
  const name = String(d.name || "").trim();
  const email = String(d.email || "").trim();
  const message = String(d.message || "").trim();
  if (name.length < 2 || name.length > 80) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(email) || email.length > 120) errors.email = "Enter a valid email address.";
  if (message.length < 10 || message.length > 2000) errors.message = "A little more detail helps us help you.";
  return { errors, clean: { name, email, message, phone: String(d.phone || "").trim().slice(0, 30) } };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const ip = getIp(req);
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, message: "That's a few messages in a row — please wait a minute and try again." });
  }

  const body = await readBody(req);

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (body && String(body.company || "").trim() !== "") {
    return res.status(200).json({ ok: true, message: "Thanks — your enquiry is in." });
  }

  const { errors, clean } = validate(body || {});
  if (Object.keys(errors).length) {
    return res.status(422).json({ ok: false, errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Apex Auto Works <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error("Contact form: missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars.");
    return res.status(500).json({ ok: false, message: "The contact form isn't configured yet. Please call us for now." });
  }

  const subject = `New website enquiry from ${clean.name}`;
  const text =
    `New enquiry via the website\n\n` +
    `Name:    ${clean.name}\n` +
    `Email:   ${clean.email}\n` +
    `Phone:   ${clean.phone || "(not given)"}\n\n` +
    `Message:\n${clean.message}\n`;
  const html =
    `<h2 style="font-family:sans-serif">New website enquiry</h2>` +
    `<p style="font-family:sans-serif"><strong>Name:</strong> ${escapeHtml(clean.name)}<br>` +
    `<strong>Email:</strong> ${escapeHtml(clean.email)}<br>` +
    `<strong>Phone:</strong> ${escapeHtml(clean.phone || "(not given)")}</p>` +
    `<p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(clean.message)}</p>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: clean.email, subject, text, html }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("Resend error:", r.status, detail);
      return res.status(502).json({ ok: false, message: "We couldn't send that just now. Please try again shortly or call us." });
    }

    return res.status(200).json({ ok: true, message: "Thanks — your enquiry is in. We'll be in touch shortly." });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return res.status(502).json({ ok: false, message: "We couldn't send that just now. Please try again shortly or call us." });
  }
};
