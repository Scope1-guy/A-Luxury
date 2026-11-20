import { STORE_NAME, WHATSAPP_NUMBER } from "../config";
import { formatMoney } from "../utils/formatMoney";

export function isWhatsAppConfigured() {
  return WHATSAPP_NUMBER.length > 0;
}

export function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  if (!isWhatsAppConfigured()) {
    window.alert(
      "WhatsApp number is not set yet. Add VITE_WHATSAPP_NUMBER to your .env file (or Netlify environment variables)."
    );
    return;
  }
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
}

// items: [{ product, size, color, quantity }]
export function buildOrderMessage({ items, subtotal, name, note }) {
  const lines = [`Hello ${STORE_NAME}, I'd like to place an order:`, ""];

  items.forEach((item, index) => {
    const variant = [
      item.size ? `Size: ${item.size}` : null,
      item.color ? `Color: ${item.color}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    lines.push(`${index + 1}. ${item.product.name}`);
    if (variant) lines.push(`   ${variant}`);
    lines.push(
      `   Qty: ${item.quantity} x ${formatMoney(item.product.price)} = ${formatMoney(
        item.product.price * item.quantity
      )}`
    );
    lines.push("");
  });

  lines.push(`Subtotal: ${formatMoney(subtotal)}`);
  lines.push("(Delivery fee to be confirmed)");

  if (name && name.trim()) {
    lines.push("", `Name: ${name.trim()}`);
  }
  if (note && note.trim()) {
    lines.push(`Delivery address / note: ${note.trim()}`);
  }

  return lines.join("\n");
}
