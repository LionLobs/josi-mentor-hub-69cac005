/** Contato oficial de suporte da Josi Nascimento. */
export const SUPPORT_PHONE = "48 99134-6742";
export const SUPPORT_PHONE_INTL = "5548991346742";

export function whatsappLink(message = "Olá! Preciso de suporte na plataforma da Josi Nascimento.") {
  return `https://wa.me/${SUPPORT_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}
