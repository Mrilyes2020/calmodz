export const PRICE_T = {
  ar: {
    unit: "سعر العلبة",
    subtotal: "مجموع العلب",
    delivery: "التوصيل",
    total: "المجموع",
    from: "ابتداءً من",
    perBox: "للعلبة",
    bulkTitle: "كلما زادت الكمية، قلّ السعر",
    bulkRow: (qty: number) => `${qty} علب فأكثر`,
    priceTitle: "السعر",
  },
  fr: {
    unit: "Prix de la boîte",
    subtotal: "Sous-total",
    delivery: "Livraison",
    total: "Total",
    from: "À partir de",
    perBox: "la boîte",
    bulkTitle: "Plus vous en prenez, moins c'est cher",
    bulkRow: (qty: number) => `${qty} boîtes ou plus`,
    priceTitle: "Prix",
  },
} as const;
