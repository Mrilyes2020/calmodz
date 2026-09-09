// Browser-safe shared types + pricing helpers for CALMO.

export type BulkTier = { qty: number; price: number };

export type SiteSettings = {
  price_da: number;
  delivery_da: number;
  currency_ar: string;
  currency_fr: string;
  show_prices: boolean;
  bulk_tiers: BulkTier[];
  whatsapp: string;
  phone_display: string;
  instagram: string;
  facebook: string;
  website: string;
  announcement_ar: string;
  announcement_fr: string;
  order_note_ar: string;
  order_note_fr: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  price_da: 2500,
  delivery_da: 500,
  currency_ar: "دج",
  currency_fr: "DA",
  show_prices: true,
  bulk_tiers: [
    { qty: 3, price: 2200 },
    { qty: 5, price: 2000 },
  ],
  whatsapp: "213796028588",
  phone_display: "+213 796 02 85 88",
  instagram: "https://instagram.com/CALMO_DZ",
  facebook: "https://facebook.com/CALMO",
  website: "https://www.calmo.com",
  announcement_ar: "توصيل إلى 58 ولاية · الدفع عند الاستلام",
  announcement_fr: "Livraison dans les 58 wilayas · Paiement à la livraison",
  order_note_ar: "",
  order_note_fr: "",
};

/** Unit price for a quantity, honouring bulk tiers (highest matching qty wins). */
export function unitPrice(s: SiteSettings, qty: number): number {
  const tiers = [...(s.bulk_tiers ?? [])]
    .filter((t) => Number(t?.qty) > 0 && Number(t?.price) >= 0)
    .sort((a, b) => a.qty - b.qty);
  let price = Number(s.price_da);
  for (const t of tiers) if (qty >= Number(t.qty)) price = Number(t.price);
  return price;
}

export function orderTotals(s: SiteSettings, qty: number) {
  const unit = unitPrice(s, qty);
  const goods = unit * qty;
  const delivery = Number(s.delivery_da) || 0;
  return { unit, goods, delivery, total: goods + delivery };
}

export function money(n: number, lang: "ar" | "fr", s: SiteSettings) {
  const value = new Intl.NumberFormat("fr-DZ").format(Math.round(n));
  return `${value} ${lang === "ar" ? s.currency_ar : s.currency_fr}`;
}
