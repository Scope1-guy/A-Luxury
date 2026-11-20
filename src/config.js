// Central settings. Values come from the .env file (locally) or from the
// Netlify dashboard (in production). See .env.example.

export const STORE_NAME = "A-LUXURY";

// Digits only, with country code, e.g. 14165551234
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  ""
);

// "Publish to web" CSV link of the Google Sheet. When empty, the site falls
// back to the sample products in src/data/sampleProducts.js.
export const SHEET_CSV_URL = (import.meta.env.VITE_SHEET_CSV_URL || "").trim();

export const CURRENCY = (import.meta.env.VITE_CURRENCY || "CAD").trim();
