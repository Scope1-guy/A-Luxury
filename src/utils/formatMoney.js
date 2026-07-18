export function formatMoney(amount, currencyCode = "CAD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}