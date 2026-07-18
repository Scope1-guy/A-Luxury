import React, { createContext, useContext, useEffect, useState } from "react";

// A starter list — add more any time. Each "code" must be a real ISO
// country code Shopify recognizes (used in the @inContext directive and
// the cart's buyerIdentity). IMPORTANT: a country only gets real localized
// pricing if it's also been added under Settings > Markets in Shopify
// admin. Countries not added there just fall back to the store's default
// currency (CAD), even though they're selectable here.
export const SUPPORTED_COUNTRIES = [
  { code: "CA", label: "Canada ($)" },
  { code: "US", label: "United States ($)" },
  { code: "GB", label: "United Kingdom (£)" },
  { code: "NG", label: "Nigeria (₦)" },
  { code: "DE", label: "Germany (€)" },
  { code: "AU", label: "Australia ($)" },
];

const STORAGE_KEY = "selected_country";
const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [country, setCountry] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "CA"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, country);
  }, [country]);

  return (
    <CurrencyContext.Provider value={{ country, setCountry }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}