import { CURRENCY } from "../config";

// export function formatMoney(amount, currencyCode = CURRENCY) {
//   return new Intl.NumberFormat(undefined, {
//     style: "currency",
//     currency: currencyCode,
//   }).format(amount);
// }

export function formatMoney(amount) {
  return (
    "$" +
    Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
