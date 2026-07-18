import React from "react";
import { useCurrency, SUPPORTED_COUNTRIES } from "../../context/CurrencyContext";
import "./CurrencySelector.css";

function CurrencySelector() {
  const { country, setCountry } = useCurrency();

  return (
    <select
      className="currency-selector"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      aria-label="Select your country for local pricing"
    >
      {SUPPORTED_COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.label}
        </option>
      ))}
    </select>
  );
}

export default CurrencySelector;