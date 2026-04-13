// ─────────────────────────────────────────────────────────────────────────────
//  Indian Bro's — White-Label Configuration
//  To set up a new restaurant, only edit this file.
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {

  // ── Restaurant identity ───────────────────────────────────────────────────
  name:        "Indian Bro's",
  tagline:     'Taste the Real Indian Food',
  description: "Authentic Indian cuisine — biryani, curries & more",
  copyright:   "© 2026 Indian Bro's. All rights reserved.",

  // ── Contact ───────────────────────────────────────────────────────────────
  phone:        '017643186357',
  phoneIntl:    '+4917643186357',
  address:      'Weyerstreet 248A',
  city:         'Solingen',
  country:      'Germany',
  social:       '@indianbros',
  website:      'https://indianbros.de',

  // ── Location (for maps & delivery distance) ───────────────────────────────
  coords: { lat: 51.178389, lng: 7.031451 },

  // ── Branding ──────────────────────────────────────────────────────────────
  // Change these two lines to restyle the entire website for a new client
  primaryColor: '#d4a017',   // saffron gold — biryani vibes
  themeColor:   '#c49010',   // browser theme bar color on mobile

  // ── External links ────────────────────────────────────────────────────────
  googleReviewLink: 'https://maps.google.com',
  formsubmitEmail:  'monetizationfast@gmail.com',

  // ── Firebase ──────────────────────────────────────────────────────────────
  firebase: {
    apiKey:            'AIzaSyBPZlNIyvlFw7CitDfRxiqpej-de-hXUDw',
    authDomain:        'indian-bro-s.firebaseapp.com',
    databaseURL:       'https://indian-bro-s-default-rtdb.europe-west1.firebasedatabase.app',
    projectId:         'indian-bro-s',
    storageBucket:     'indian-bro-s.firebasestorage.app',
    messagingSenderId: '161370117881',
    appId:             '1:161370117881:web:a862e18874b264fba3b428'
  }
};

// ── Apply branding colors to CSS variables immediately ────────────────────
(function() {
  // Convert hex to rgb components for rgba() usage in CSS
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return r + ',' + g + ',' + b;
  }
  const p = CONFIG.primaryColor;
  const rgb = hexToRgb(p);
  const root = document.documentElement;
  root.style.setProperty('--primary',       p);
  root.style.setProperty('--primary-rgb',   rgb);
  root.style.setProperty('--primary-glow',  'rgba(' + rgb + ',0.35)');
  // Update theme-color meta tag
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = CONFIG.themeColor;
})();
