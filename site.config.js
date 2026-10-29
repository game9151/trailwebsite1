/*
 * site.config.js
 * ---------------------------------------------------------------------------
 * The single source of truth for this website. Edit THIS file to reskin the
 * page for a new client — every section, the colours, fonts, SEO tags and the
 * LocalBusiness structured data all render from here. Nothing business-specific
 * is hardcoded in index.html.
 *
 * Loaded as a plain script (not a module) so it works from file:// previews and
 * on Vercel without a build step. It attaches a global `SITE` object.
 */
window.SITE = {
  /* ---- Identity ---------------------------------------------------------- */
  name: "Apex Auto Works",
  shortName: "Apex",
  tagline: "Straight-talking car care, done right the first time.",
  // A longer sentence used in the hero sub-headline.
  intro:
    "Independent garage in Harwell serving drivers across South Oxfordshire. Diagnostics, servicing, MOT and repairs — clear quotes before we touch a thing.",
  // Used for <title>, og:site_name and the footer.
  legalName: "Apex Auto Works Ltd",
  foundedYear: 2009,

  // Hero headline (kept short and bold; the one memorable moment on the page).
  hero: {
    headline: "Keeping the Vale on the road",
  },

  // Social proof shown next to the hero buttons.
  rating: { score: "4.9", count: "380+", source: "Google reviews" },

  /* ---- Contact ----------------------------------------------------------- */
  phoneDisplay: "01235 555 018",
  phoneDial: "+441235555018", // E.164, used for tel: links
  email: "hello@apexautoworks.co.uk",
  address: {
    street: "Unit 4, Barrow Industrial Estate",
    locality: "Harwell",
    region: "Oxfordshire",
    postalCode: "OX11 6QR",
    country: "GB",
  },
  // Optional map coordinates (used by JSON-LD). Leave null to skip.
  geo: { lat: 51.5908, lng: -1.2998 },

  /* ---- Hours (24h, used for display + schema.org openingHours) ----------- */
  hours: [
    { day: "Monday", open: "08:00", close: "18:00" },
    { day: "Tuesday", open: "08:00", close: "18:00" },
    { day: "Wednesday", open: "08:00", close: "18:00" },
    { day: "Thursday", open: "08:00", close: "18:00" },
    { day: "Friday", open: "08:00", close: "18:00" },
    { day: "Saturday", open: "08:30", close: "13:00" },
    { day: "Sunday", open: null, close: null }, // null = Closed
  ],

  /* ---- Trust bar (shown under the hero) ---------------------------------- */
  stats: [
    { value: "16", unit: "yrs", label: "Serving the Vale" },
    { value: "12,000+", unit: "", label: "Cars back on the road" },
    { value: "12", unit: "mo", label: "Parts & labour warranty" },
    { value: "4.9", unit: "/5", label: "From 380+ reviews" },
  ],

  /* ---- Services ---------------------------------------------------------- *
   * `icon` maps to an inline SVG in app.js (see ICONS). `image` is the photo
   * filename that will be used if it exists in /images, otherwise the SVG
   * illustration is drawn instead. `from` is an optional starting price.      */
  services: [
    {
      icon: "diagnostics",
      title: "Diagnostics & Engine",
      desc: "Dealer-level fault reading for warning lights, misfires and running faults — with a plain-English explanation of what it means.",
      from: "49",
      image: "service-diagnostics.jpg",
    },
    {
      icon: "service",
      title: "Servicing & MOT",
      desc: "Interim, full and manufacturer-schedule servicing, plus MOT testing and any work needed to get you through.",
      from: "99",
      image: "service-servicing.jpg",
    },
    {
      icon: "brakes",
      title: "Brakes & Suspension",
      desc: "Pads, discs, shocks and springs fitted with quality parts. Free brake check if something doesn't feel right.",
      from: "89",
      image: "service-brakes.jpg",
    },
    {
      icon: "tyre",
      title: "Tyres & Alignment",
      desc: "Supply and fitting across all major brands, plus four-wheel laser alignment to stop uneven wear.",
      from: "55",
      image: "service-tyres.jpg",
    },
    {
      icon: "ac",
      title: "Air Conditioning",
      desc: "Re-gas, leak testing and anti-bacterial treatment for R134a and R1234yf systems. Cold air, no fuss.",
      from: "65",
      image: "service-ac.jpg",
    },
    {
      icon: "battery",
      title: "Battery & Electrical",
      desc: "Charging faults, starting problems, wiring and sensor diagnosis — including hybrid 12V systems.",
      from: "45",
      image: "service-electrical.jpg",
    },
  ],

  /* ---- Why choose us ----------------------------------------------------- */
  reasons: [
    {
      icon: "quote",
      title: "The quote is the price",
      desc: "We call with a fixed figure before any work starts. No surprise lines on the invoice when you collect.",
    },
    {
      icon: "wrench",
      title: "Technicians, not upsellers",
      desc: "Our team is IMI-qualified and paid for good work, not for selling you parts you don't need.",
    },
    {
      icon: "shield",
      title: "Every job is warrantied",
      desc: "Parts and labour are covered for 12 months. If something isn't right, bring it back and we'll sort it.",
    },
    {
      icon: "car",
      title: "Any make, any age",
      desc: "From a 2003 Corsa to the latest hybrid, we have the kit and the data to work on it properly.",
    },
  ],

  /* ---- 3-step process (a genuine sequence) ------------------------------- */
  process: [
    {
      title: "Book it in",
      desc: "Call or send the form with your reg and what's wrong. We'll find you a slot, often same week.",
    },
    {
      title: "We diagnose & quote",
      desc: "We inspect, pin down the fault and phone you with a fixed price. Nothing happens until you say yes.",
    },
    {
      title: "You approve, we fix",
      desc: "We carry out the agreed work, test it, and hand the car back clean with everything explained.",
    },
  ],

  /* ---- Reviews ----------------------------------------------------------- */
  reviews: [
    {
      quote:
        "Diagnosed a misfire three other garages had thrown parts at. Fixed properly, and cheaper than the main dealer's guess.",
      name: "Priya Shah",
      detail: "VW Golf owner, Didcot",
      rating: 5,
    },
    {
      quote:
        "Rang me with the price before doing anything, stuck to it exactly, and had my brakes done the same afternoon.",
      name: "Tom Ellery",
      detail: "Ford Focus owner, Wantage",
      rating: 5,
    },
    {
      quote:
        "Honest about what actually needed doing for the MOT and what could wait. First garage I've genuinely trusted.",
      name: "Dervla Quinn",
      detail: "Nissan Qashqai owner, Abingdon",
      rating: 5,
    },
  ],

  /* ---- Pricing (indicative "from" prices) -------------------------------- */
  pricing: [
    { job: "Interim service", price: "99" },
    { job: "Full service", price: "179" },
    { job: "MOT test", price: "45" },
    { job: "Diagnostic inspection", price: "49" },
    { job: "Front brake pads (fitted)", price: "89" },
    { job: "Air-con re-gas", price: "65" },
    { job: "Cam belt replacement", price: "299" },
    { job: "Wheel alignment (4-wheel)", price: "59" },
  ],
  pricingNote:
    "Guide prices for common cars. We'll always confirm the exact figure for your vehicle before any work.",
  currency: "£",

  /* ---- FAQ --------------------------------------------------------------- */
  faq: [
    {
      q: "Do I need an appointment?",
      a: "For most work, yes — it means we have the right parts and time set aside. For a warning light or a quick look, call and we'll usually fit you in.",
    },
    {
      q: "Can you work on my car under warranty?",
      a: "Yes. Using an independent garage for servicing does not void your manufacturer warranty, as long as the correct schedule and parts are used — which is exactly what we do.",
    },
    {
      q: "Will you show me the old parts?",
      a: "Always. Anything we replace is kept for you to see, and we'll explain why it needed doing.",
    },
    {
      q: "Do you offer collection or a courtesy car?",
      a: "We have a local collection-and-return service and a small number of courtesy cars — ask when you book and we'll do our best to sort it.",
    },
    {
      q: "What payment methods do you take?",
      a: "Card, bank transfer and cash. Payment is due on collection once you're happy with the work.",
    },
  ],

  /* ---- Service area ------------------------------------------------------ */
  serviceArea: {
    intro: "If you're within about 15 minutes of Harwell, we've got you covered:",
    towns: [
      "Harwell",
      "Didcot",
      "Wantage",
      "Abingdon",
      "Grove",
      "Milton",
      "Chilton",
      "Steventon",
      "Rowstock",
      "East Hendred",
    ],
  },

  /* ---- Socials (empty strings are hidden) -------------------------------- */
  socials: {
    facebook: "https://facebook.com/apexautoworks",
    instagram: "https://instagram.com/apexautoworks",
    google: "https://g.page/apexautoworks",
  },

  /* ---- Imagery ----------------------------------------------------------- *
   * Each slot tries its photo first and falls back to a drawn SVG if the file
   * is missing. Drop a real photo into /images with the exact filename and it
   * appears automatically — no code change needed.                           */
  images: {
    // Set to true once you have real photos in /images (the fetch-images
    // script sets this automatically). false = use the built-in SVG
    // illustrations only, so the page has zero photo requests.
    usePhotos: false,
    hero: { file: "hero-workshop.jpg", alt: "Technician working under a car raised on a ramp at Apex Auto Works" },
    workshop: { file: "workshop.jpg", alt: "The Apex Auto Works workshop with service bays and ramps" },
    team: { file: "team.jpg", alt: "The Apex Auto Works technician team" },
  },

  /* ---- SEO / social sharing --------------------------------------------- */
  seo: {
    // Set this to your real deployed URL for correct canonical + OG links.
    url: "https://apexautoworks.co.uk",
    title: "Apex Auto Works — Car Servicing, MOT & Repairs in Harwell",
    description:
      "Independent garage in Harwell, Oxfordshire. Diagnostics, servicing, MOT, brakes, tyres and air-con — with fixed quotes before any work and a 12-month warranty.",
    ogImage: "images/hero-workshop.jpg", // falls back gracefully if absent
    themeColor: "#15191E",
  },

  /* ---- Brand palette & fonts (applied to CSS variables at load) ---------- *
   * Change these to reskin the whole site. Keep accent contrast in mind:
   * `accentText` is the colour of text placed on top of the accent.          */
  theme: {
    colors: {
      ink: "#15191E",
      steel: "#273340",
      steel2: "#334150",
      paper: "#F3F4F2",
      panel: "#E7E9E6",
      accent: "#F5A524",
      accentText: "#1A1204",
      line: "rgba(21,25,30,0.14)",
      lineOnDark: "rgba(255,255,255,0.14)",
    },
    fonts: {
      // Family names must match the Google Fonts loaded in index.html.
      display: "'Saira Condensed', 'Arial Narrow', sans-serif",
      body: "'Hanken Grotesk', system-ui, sans-serif",
    },
  },
};
