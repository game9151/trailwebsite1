/* ===========================================================================
   app.js — renders the whole page from window.SITE (site.config.js).
   Plain, dependency-free. No build step.
   =========================================================================== */
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) { console.error("site.config.js did not load — SITE is undefined."); return; }

  /* ---- Tiny helpers ----------------------------------------------------- */
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function money(v) { return esc(S.currency || "£") + esc(v); }
  function fullAddress() {
    var a = S.address || {};
    return [a.street, a.locality, a.region, a.postalCode].filter(Boolean).join(", ");
  }

  /* ---- Inline icon set (stroked, inherits currentColor) ----------------- */
  var STROKE = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICONS = {
    diagnostics: '<path d="M4 15a8 8 0 0 1 16 0"/><path d="M12 15l4.2-3.2"/><circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none"/><path d="M4 18.5h16"/>',
    service: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.8-1.4-1.8-3.1-2.1.9a7.6 7.6 0 0 0-2.6-1.5L14.4 2h-3.6l-.3 2.4a7.6 7.6 0 0 0-2.6 1.5l-2.1-.9L2 8.1l1.8 1.4a7.6 7.6 0 0 0 0 3L2 13.9 3.8 17l2.1-.9a7.6 7.6 0 0 0 2.6 1.5l.3 2.4h3.6l.3-2.4a7.6 7.6 0 0 0 2.6-1.5l2.1.9L21.2 14z"/>',
    brakes: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2"/><path d="M16.5 7.5h2a1 1 0 0 1 1 1v2"/>',
    tyre: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/>',
    ac: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17"/><path d="M12 6l-2.2 1.3M12 6l2.2 1.3M12 18l-2.2-1.3M12 18l2.2-1.3M4.5 10.2l2.5.1M4.5 13.8l2.5-.1M19.5 10.2l-2.5.1M19.5 13.8l-2.5-.1"/>',
    battery: '<rect x="3" y="7.5" width="18" height="10" rx="1.2"/><path d="M7 7.5V5.5h3v2M14 7.5V5.5h3v2"/><path d="M7.5 12.5h2.4M8.7 11.3v2.4"/><path d="M14.2 12.5h2.4"/>',
    quote: '<path d="M4 11.4V5.2A1.2 1.2 0 0 1 5.2 4h6.2l8.6 8.6a1.6 1.6 0 0 1 0 2.3l-4.9 4.9a1.6 1.6 0 0 1-2.3 0L4 11.4z"/><circle cx="8" cy="8" r="1.3"/>',
    wrench: '<path d="M15.5 6.2a3.8 3.8 0 0 0-4.9 4.6l-6.1 6.1 2.6 2.6 6.1-6.1a3.8 3.8 0 0 0 4.6-4.9l-2.3 2.3-2.2-.6-.6-2.2z"/>',
    shield: '<path d="M12 3l7 2.8v4.9c0 4.6-3 7.8-7 9.3-4-1.5-7-4.7-7-9.3V5.8z"/><path d="M8.8 12l2.2 2.2 4.2-4.3"/>',
    car: '<path d="M3 16.5v-3l2-5.2A2 2 0 0 1 6.9 7h10.2a2 2 0 0 1 1.9 1.3l2 5.2v3a1 1 0 0 1-1 1h-1.2M5.2 17.5H4a1 1 0 0 1-1-1M5 13h14"/><circle cx="7.6" cy="16.6" r="1.7"/><circle cx="16.4" cy="16.6" r="1.7"/>',
    star: '<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.6 6.2 20.5l1.1-6.45L2.6 9.45 9.1 8.5z" fill="currentColor" stroke="none"/>',
    phone: '<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z" fill="currentColor" stroke="none"/>',
    pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.6 6.2L12 12l8.4-5.8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/>',
    facebook: '<path d="M13 21v-7h2.3l.4-3H13V9.2c0-.9.3-1.5 1.6-1.5H16V5.1C15.6 5 14.7 5 13.7 5 11.6 5 10 6.3 10 8.8V11H7.7v3H10v7z" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="16.7" cy="7.3" r="1" fill="currentColor" stroke="none"/>',
    google: '<path d="M21 11H12v2.8h5.2A5.3 5.3 0 0 1 6.7 12 5.3 5.3 0 0 1 15.6 8l2-2A8 8 0 1 0 20 12.5"/>',
  };
  function icon(name, cls) {
    var body = ICONS[name] || ICONS.wrench;
    return '<svg class="' + (cls || "") + '" ' + STROKE + ">" + body + "</svg>";
  }
  function stars(n) {
    var out = "";
    for (var i = 0; i < (n || 5); i++) out += '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS.star + "</svg>";
    return '<span class="stars" role="img" aria-label="' + (n || 5) + ' out of 5 stars">' + out + "</span>";
  }

  /* ---- Blueprint illustrations (SVG fallbacks for photo slots) ---------- */
  var GRID = '<defs><pattern id="bp" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M34 0H0V34" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/></pattern></defs>';
  function illoWrap(inner) {
    return '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      GRID + '<rect width="800" height="600" fill="#1b232d"/><rect width="800" height="600" fill="url(#bp)"/>' + inner + "</svg>";
  }
  var ACC = "#f5a524", LINE = "rgba(255,255,255,.55)", DIM = "rgba(255,255,255,.28)";
  var ILLO = {
    // Car raised on a two-post ramp — the workshop hero.
    hero: illoWrap(
      // ground + posts
      '<path d="M60 470H740" stroke="' + DIM + '" stroke-width="3"/>' +
      '<rect x="120" y="150" width="16" height="320" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
      '<rect x="664" y="150" width="16" height="320" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
      '<path d="M128 300H280M520 300H672" stroke="' + ACC + '" stroke-width="4"/>' +
      // car body raised
      '<g transform="translate(0,-18)">' +
      '<path d="M250 300h300l44 8 36 40c6 7 2 20-8 20H214c-9 0-14-11-8-19l32-41z" fill="none" stroke="' + LINE + '" stroke-width="3.5"/>' +
      '<path d="M296 300l26-46c5-9 14-14 24-14h96c10 0 20 6 25 15l22 45" fill="none" stroke="' + LINE + '" stroke-width="3.5"/>' +
      '<path d="M330 300l18-40h60l16 40" fill="none" stroke="' + DIM + '" stroke-width="2.5"/>' +
      '<circle cx="320" cy="372" r="30" fill="none" stroke="' + ACC + '" stroke-width="4"/><circle cx="320" cy="372" r="12" fill="none" stroke="' + LINE + '" stroke-width="2.5"/>' +
      '<circle cx="492" cy="372" r="30" fill="none" stroke="' + ACC + '" stroke-width="4"/><circle cx="492" cy="372" r="12" fill="none" stroke="' + LINE + '" stroke-width="2.5"/>' +
      "</g>" +
      // gear motif
      '<g transform="translate(628,118)" stroke="' + ACC + '" stroke-width="3" fill="none"><circle r="30"/><circle r="12"/>' +
      '<g>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (d) { return '<line x1="0" y1="-30" x2="0" y2="-40" transform="rotate(' + d + ')"/>'; }).join("") + "</g></g>" +
      // measurement ticks
      '<path d="M120 500H680" stroke="' + DIM + '" stroke-width="2"/>' +
      [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<line x1="' + (120 + i * 93) + '" y1="494" x2="' + (120 + i * 93) + '" y2="506" stroke="' + DIM + '" stroke-width="2"/>'; }).join("")
    ),
    // Garage bay — roller door, bench, tools.
    workshop: illoWrap(
      '<path d="M60 150H740" stroke="' + DIM + '" stroke-width="2"/>' +
      '<rect x="110" y="150" width="340" height="300" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
      [185, 220, 255, 290, 325, 360, 395, 430].map(function (y) { return '<line x1="110" y1="' + y + '" x2="450" y2="' + y + '" stroke="' + DIM + '" stroke-width="1.5"/>'; }).join("") +
      '<rect x="150" y="190" width="40" height="40" fill="' + ACC + '" opacity=".85"/>' +
      // workbench + pegboard
      '<rect x="500" y="300" width="210" height="18" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
      '<line x1="520" y1="318" x2="520" y2="450" stroke="' + LINE + '" stroke-width="3"/><line x1="690" y1="318" x2="690" y2="450" stroke="' + LINE + '" stroke-width="3"/>' +
      '<rect x="505" y="170" width="200" height="110" fill="none" stroke="' + DIM + '" stroke-width="2"/>' +
      '<g stroke="' + ACC + '" stroke-width="3" fill="none" stroke-linecap="round"><path d="M540 195l30 30"/><path d="M620 190v40"/><circle cx="665" cy="205" r="12"/></g>' +
      '<path d="M120 480H690" stroke="' + DIM + '" stroke-width="2"/>'
    ),
    // Crew — two stylised technicians (blueprint, no faces).
    team: '<svg viewBox="0 0 640 800" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      GRID + '<rect width="640" height="800" fill="#1b232d"/><rect width="640" height="800" fill="url(#bp)"/>' +
      '<g fill="none" stroke="' + LINE + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
      // figure 1
      '<circle cx="230" cy="250" r="54"/><path d="M176 236a54 54 0 0 1 108 0" stroke="' + ACC + '"/>' +
      '<path d="M150 470c0-70 36-120 80-120s80 50 80 120v180H150z"/>' +
      '<path d="M190 470v180M270 470v180" stroke="' + DIM + '" stroke-width="2.5"/>' +
      // figure 2
      '<circle cx="420" cy="300" r="48"/><path d="M372 288a48 48 0 0 1 96 0" stroke="' + ACC + '"/>' +
      '<path d="M352 500c0-64 32-110 72-110s72 46 72 110v150H352z"/>' +
      '<path d="M388 500v150M460 500v150" stroke="' + DIM + '" stroke-width="2.5"/>' +
      // wrench badge
      '<path d="M300 540a26 26 0 0 0-33 31l-40 40 18 18 40-40a26 26 0 0 0 31-33l-15 15-15-4-4-15z" stroke="' + ACC + '"/>' +
      "</g></svg>",
  };

  /* ---- Media slot: photo if present, else SVG illustration -------------- */
  function media(slotKey, extraClass) {
    var cfg = (S.images && S.images[slotKey]) || {};
    var usePhotos = !!(S.images && S.images.usePhotos);
    var file = cfg.file ? "images/" + cfg.file : "";
    var alt = cfg.alt || "";
    var illo = ILLO[slotKey] || ILLO.workshop;
    // Only request a photo when opted in — otherwise no network request is
    // made (clean console) and the SVG illustration is shown. The onerror/
    // onload handlers still make a dropped-in photo "just work".
    var imgTag = (usePhotos && file)
      ? '<img src="' + esc(file) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async" ' +
        'onload="window.SITEUI.photoOk(this)" onerror="window.SITEUI.photoFail(this)">'
      : "";
    return '<div class="media ' + (extraClass || "") + '" ' + (alt ? 'role="img" aria-label="' + esc(alt) + '"' : "") + ">" + illo + imgTag + "</div>";
  }
  window.SITEUI = {
    photoOk: function (img) { img.parentNode.classList.add("has-photo"); },
    photoFail: function (img) { img.parentNode.classList.add("no-photo"); },
  };

  /* ---- Section renderers ------------------------------------------------ */
  function brand(onDark) {
    return '<a class="brand" href="#top" aria-label="' + esc(S.name) + ' home">' +
      '<span class="brand-mark">' + esc((S.shortName || S.name)[0]) + "</span>" +
      '<span class="brand-name">' + esc(S.name) + "</span></a>";
  }

  function renderHeader(host) {
    var nav = [
      ["#services", "Services"], ["#process", "How it works"],
      ["#pricing", "Pricing"], ["#area", "Area"], ["#contact", "Contact"],
    ].map(function (n) { return '<a href="' + n[0] + '">' + n[1] + "</a>"; }).join("");
    host.innerHTML =
      '<div class="container header-inner">' +
        brand() +
        '<nav class="header-nav" aria-label="Primary">' + nav + "</nav>" +
        '<div class="header-cta">' +
          '<a class="header-phone" href="tel:' + esc(S.phoneDial) + '">' +
            icon("phone") + '<span class="label">' + esc(S.phoneDisplay) + "</span></a>" +
          '<a class="btn btn-primary" href="#contact">Book a service</a>' +
        "</div>" +
      "</div>";
  }

  function renderHero(host) {
    host.innerHTML =
      '<div class="container hero-inner">' +
        '<div class="hero-copy reveal">' +
          '<span class="hero-eyebrow"><span class="rule"></span>Independent garage in ' + esc(S.address.locality) + "</span>" +
          "<h1>" + esc((S.hero && S.hero.headline) || S.tagline) + "</h1>" +
          '<p class="hero-sub">' + esc(S.intro) + "</p>" +
          '<div class="hero-actions">' +
            '<a class="btn btn-primary" href="tel:' + esc(S.phoneDial) + '">' + icon("phone") + "Call " + esc(S.phoneDisplay) + "</a>" +
            '<a class="btn btn-outline" href="#contact">Book a service</a>' +
          "</div>" +
          (S.rating ? '<p class="hero-rating">' + stars(5) + "<span>Rated <b>" + esc(S.rating.score) +
            "/5</b> from " + esc(S.rating.count) + " " + esc(S.rating.source) + "</span></p>" : "") +
        "</div>" +
        '<div class="hero-media reveal">' + media("hero") +
          '<div class="hero-badge"><b>12</b><span>month<br>warranty</span></div>' +
        "</div>" +
      "</div>";
  }

  function renderTrust(host) {
    var items = (S.stats || []).map(function (s) {
      return '<div class="trust-item"><div class="trust-value">' + esc(s.value) +
        (s.unit ? '<span class="unit">' + esc(s.unit) + "</span>" : "") +
        '</div><div class="trust-label">' + esc(s.label) + "</div></div>";
    }).join("");
    host.innerHTML = '<div class="container"><div class="trust-grid reveal-stagger">' + items + "</div></div>";
  }

  function renderServices(host) {
    var cards = (S.services || []).map(function (s) {
      return '<article class="service-card">' +
        '<span class="service-icon">' + icon(s.icon) + "</span>" +
        "<h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p>" +
        (s.from ? '<div class="service-from">from <b>' + money(s.from) + "</b></div>" : "") +
        "</article>";
    }).join("");
    host.innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal"><span class="kicker">What we do</span>' +
        '<h2 id="services-title">Everything your car needs, under one roof</h2></div>' +
        '<div class="services-grid reveal-stagger">' + cards + "</div>" +
      "</div>";
  }

  function renderWhy(host) {
    host.classList.add("section", "section-dark");
    var items = (S.reasons || []).map(function (r) {
      return '<div class="why-item"><span class="why-icon">' + icon(r.icon) + "</span>" +
        "<div><h3>" + esc(r.title) + "</h3><p>" + esc(r.desc) + "</p></div></div>";
    }).join("");
    host.innerHTML =
      '<div class="container why-layout">' +
        '<div class="why-media reveal">' + media("team") + "</div>" +
        '<div class="reveal"><div class="section-head"><span class="kicker">Why drivers stay with us</span>' +
        '<h2 id="why-title">No jargon, no surprises, no pressure</h2></div>' +
        '<div class="why-grid">' + items + "</div></div>" +
      "</div>";
  }

  function renderProcess(host) {
    var steps = (S.process || []).map(function (p) {
      return '<div class="process-step"><h3>' + esc(p.title) + "</h3><p>" + esc(p.desc) + "</p></div>";
    }).join("");
    host.innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal"><span class="kicker">How it works</span>' +
        '<h2 id="process-title">From booking to back on the road</h2></div>' +
        '<div class="process-grid reveal-stagger">' + steps + "</div>" +
      "</div>";
  }

  function renderReviews(host) {
    var cards = (S.reviews || []).map(function (r) {
      return '<figure class="review-card">' + stars(r.rating) +
        "<blockquote>" + esc(r.quote) + "</blockquote>" +
        '<figcaption class="review-meta"><div class="review-name">' + esc(r.name) + "</div>" +
        '<div class="review-detail">' + esc(r.detail) + "</div></figcaption></figure>";
    }).join("");
    host.innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal"><span class="kicker">Reviews</span>' +
        '<h2 id="reviews-title">What people say after they collect</h2></div>' +
        '<div class="reviews-grid reveal-stagger">' + cards + "</div>" +
      "</div>";
  }

  function renderPricing(host) {
    var rows = (S.pricing || []).map(function (p) {
      return '<li class="price-row"><span class="job">' + esc(p.job) +
        '</span><span class="amt"><span class="from">from</span>' + money(p.price) + "</span></li>";
    }).join("");
    var faqs = (S.faq || []).map(function (f) {
      return '<details class="faq-item"><summary>' + esc(f.q) + "</summary>" +
        '<div class="faq-a">' + esc(f.a) + "</div></details>";
    }).join("");
    host.innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal"><span class="kicker">Pricing &amp; questions</span>' +
        '<h2 id="pricing-title">Clear prices, answered honestly</h2></div>' +
        '<div class="pricing-layout">' +
          '<div class="reveal"><ul class="price-list">' + rows + "</ul>" +
          '<p class="price-note">' + esc(S.pricingNote || "") + "</p></div>" +
          '<div class="reveal">' + faqs + "</div>" +
        "</div>" +
      "</div>";
  }

  function renderArea(host) {
    host.classList.add("section", "section-dark");
    var chips = (S.serviceArea.towns || []).map(function (t, i) {
      return '<span class="town-chip' + (i === 0 ? " is-base" : "") + '">' + esc(t) + "</span>";
    }).join("");
    host.innerHTML =
      '<div class="container area-layout">' +
        '<div class="reveal"><div class="section-head"><span class="kicker">Where we work</span>' +
        '<h2 id="area-title">Local to Harwell and the Vale</h2></div>' +
        '<p class="lede">' + esc(S.serviceArea.intro) + "</p>" +
        '<div class="area-towns">' + chips + "</div></div>" +
        '<div class="area-media reveal">' + media("workshop") + "</div>" +
      "</div>";
  }

  function renderContact(host) {
    var addr = S.address || {};
    var mapSrc = "https://www.google.com/maps?q=" + encodeURIComponent(S.name + ", " + fullAddress()) + "&output=embed";
    var hoursRows = (S.hours || []).map(function (h) {
      var val = h.open && h.close ? h.open + " – " + h.close : '<span class="closed">Closed</span>';
      return '<tr data-day="' + esc(h.day) + '"><td>' + esc(h.day) + "</td><td>" + val + "</td></tr>";
    }).join("");
    host.innerHTML =
      '<div class="container">' +
        '<div class="section-head reveal"><span class="kicker">Get in touch</span>' +
        '<h2 id="contact-title">Book a service or ask us anything</h2></div>' +
        '<div class="contact-layout">' +
          '<form class="contact-form reveal" data-form novalidate>' +
            '<div class="form-status" data-status role="status" aria-live="polite"></div>' +
            '<div class="form-row">' +
              '<div class="field"><label for="f-name">Name <span class="req" aria-hidden="true">*</span></label>' +
              '<input id="f-name" name="name" type="text" autocomplete="name" required maxlength="80">' +
              '<span class="err" data-err="name"></span></div>' +
              '<div class="field"><label for="f-phone">Phone</label>' +
              '<input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="30">' +
              '<span class="err" data-err="phone"></span></div>' +
            "</div>" +
            '<div class="field"><label for="f-email">Email <span class="req" aria-hidden="true">*</span></label>' +
            '<input id="f-email" name="email" type="email" autocomplete="email" required maxlength="120">' +
            '<span class="err" data-err="email"></span></div>' +
            '<div class="field"><label for="f-msg">What can we help with? <span class="req" aria-hidden="true">*</span></label>' +
            '<textarea id="f-msg" name="message" required maxlength="2000" placeholder="Your reg, the car, and what\'s going on…"></textarea>' +
            '<span class="err" data-err="message"></span></div>' +
            // Honeypot: real people never see or fill this.
            '<div class="hp" aria-hidden="true"><label>Company (leave blank)<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>' +
            '<button class="btn btn-primary" type="submit" data-submit>Send enquiry</button>' +
          "</form>" +
          '<aside class="contact-aside reveal">' +
            '<div class="info-card"><h3>Visit the workshop</h3>' +
              '<div class="info-line">' + icon("pin") + "<span>" + esc(addr.street) + "<br>" + esc(addr.locality) + ", " + esc(addr.region) + " " + esc(addr.postalCode) + "</span></div>" +
              '<div class="info-line">' + icon("phone") + '<a href="tel:' + esc(S.phoneDial) + '">' + esc(S.phoneDisplay) + "</a></div>" +
              '<div class="info-line">' + icon("mail") + '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></div>" +
            "</div>" +
            '<div class="info-card"><h3>Opening hours</h3><table class="hours-table"><tbody>' + hoursRows + "</tbody></table></div>" +
            '<div class="map-embed"><iframe title="Map to ' + esc(S.name) + '" src="' + esc(mapSrc) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>' +
          "</aside>" +
        "</div>" +
      "</div>";
  }

  function renderFooter(host) {
    var navCols =
      '<div class="footer-col"><h4>Services</h4>' +
        (S.services || []).slice(0, 6).map(function (s) { return '<a href="#services">' + esc(s.title) + "</a>"; }).join("") +
      "</div>" +
      '<div class="footer-col"><h4>Visit</h4>' +
        '<a href="tel:' + esc(S.phoneDial) + '">' + esc(S.phoneDisplay) + "</a>" +
        '<a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>" +
        '<a href="#contact">' + esc(S.address.locality) + ", " + esc(S.address.postalCode) + "</a>" +
      "</div>";
    var soc = "";
    if (S.socials) {
      var keys = Object.keys(S.socials).filter(function (k) { return S.socials[k]; });
      if (keys.length) {
        soc = '<div class="socials">' + keys.map(function (k) {
          return '<a href="' + esc(S.socials[k]) + '" aria-label="' + esc(S.name) + " on " + k + '" rel="noopener" target="_blank">' + icon(k) + "</a>";
        }).join("") + "</div>";
      }
    }
    host.innerHTML =
      '<div class="container">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' + brand() +
            "<p>" + esc(S.legalName) + " — straight-talking servicing, MOT and repairs in " + esc(S.address.locality) + ". " + soc + "</p>" +
          "</div>" + navCols +
        "</div>" +
        '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " " + esc(S.legalName) + ". All rights reserved.</span>" +
        "<span>Built to be easy to maintain. Prices are guides, confirmed before work.</span></div>" +
      "</div>";
  }

  /* ---- Contact form behaviour ------------------------------------------ */
  function setupForm(form) {
    if (!form) return;
    var statusEl = form.querySelector("[data-status]");
    var btn = form.querySelector("[data-submit]");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setErr(field, msg) {
      var wrap = form.querySelector('[name="' + field + '"]').closest(".field");
      var err = form.querySelector('[data-err="' + field + '"]');
      if (wrap) wrap.classList.toggle("invalid", !!msg);
      if (err) err.textContent = msg || "";
    }
    function clearErrs() { ["name", "email", "phone", "message"].forEach(function (f) { setErr(f, ""); }); }
    function showStatus(kind, msg) {
      statusEl.className = "form-status show " + kind;
      statusEl.textContent = msg;
    }

    function validate(data) {
      var ok = true;
      if (!data.name || data.name.trim().length < 2) { setErr("name", "Please tell us your name."); ok = false; }
      if (!emailRe.test(data.email || "")) { setErr("email", "Enter a valid email address."); ok = false; }
      if (!data.message || data.message.trim().length < 10) { setErr("message", "A little more detail helps us help you."); ok = false; }
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrs();
      var data = {
        name: form.name.value, email: form.email.value, phone: form.phone.value,
        message: form.message.value, company: form.company.value,
      };
      if (!validate(data)) { showStatus("bad", "Please fix the highlighted fields and try again."); return; }

      btn.disabled = true;
      var original = btn.textContent;
      btn.textContent = "Sending…";
      statusEl.className = "form-status";

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (body) { return { res: res, body: body }; }); })
        .then(function (r) {
          if (r.res.ok && r.body.ok) {
            form.reset();
            showStatus("ok", r.body.message || "Thanks — your enquiry is in. We'll be in touch shortly.");
          } else if (r.res.status === 422 && r.body.errors) {
            Object.keys(r.body.errors).forEach(function (k) { setErr(k, r.body.errors[k]); });
            showStatus("bad", "Please check the highlighted fields.");
          } else if (r.res.status === 429) {
            showStatus("bad", r.body.message || "That's a few messages in a row — please wait a minute and try again.");
          } else {
            showStatus("bad", r.body.message || "We couldn't send that just now. Please call us on " + S.phoneDisplay + ".");
          }
        })
        .catch(function () {
          showStatus("bad", "Network trouble — please try again, or call us on " + S.phoneDisplay + ".");
        })
        .finally(function () { btn.disabled = false; btn.textContent = original; });
    });
  }

  /* ---- Misc enhancements ------------------------------------------------ */
  function highlightToday() {
    var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var today = names[new Date().getDay()];
    var row = document.querySelector('.hours-table tr[data-day="' + today + '"]');
    if (row) row.classList.add("is-today");
  }
  function setupCallFab() {
    var fab = document.querySelector("[data-call-fab]");
    if (fab) {
      fab.setAttribute("href", "tel:" + S.phoneDial);
      var t = fab.querySelector("[data-call-fab-text]");
      if (t) t.textContent = "Call us";
    }
  }
  function setupReveal() {
    var els = document.querySelectorAll(".reveal, .reveal-stagger");
    function revealAll() { els.forEach(function (el) { el.classList.add("in"); }); }
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No animation wanted/possible → just show everything.
    if (reduce || !("IntersectionObserver" in window)) { revealAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: anything not revealed within 2.5s is shown anyway, so
    // content can never get stuck hidden by an observer edge case.
    setTimeout(revealAll, 2500);
  }

  /* ---- Boot ------------------------------------------------------------- */
  function q(sel) { return document.querySelector(sel); }
  document.body.id = document.body.id || "top";
  renderHeader(q("[data-header]"));
  renderHero(q("[data-hero]"));
  renderTrust(q("[data-trust]"));
  renderServices(q("[data-services]"));
  renderWhy(q("[data-why]"));
  renderProcess(q("[data-process]"));
  renderReviews(q("[data-reviews]"));
  renderPricing(q("[data-pricing]"));
  renderArea(q("[data-area]"));
  renderContact(q("[data-contact]"));
  renderFooter(q("[data-footer]"));

  setupForm(q("[data-form]"));
  highlightToday();
  setupCallFab();
  setupReveal();
})();
