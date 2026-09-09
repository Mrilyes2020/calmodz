CREATE TABLE public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  price_da NUMERIC NOT NULL DEFAULT 2500,
  delivery_da NUMERIC NOT NULL DEFAULT 500,
  currency_ar TEXT NOT NULL DEFAULT 'دج',
  currency_fr TEXT NOT NULL DEFAULT 'DA',
  show_prices BOOLEAN NOT NULL DEFAULT true,
  bulk_tiers JSONB NOT NULL DEFAULT '[{"qty":3,"price":2200},{"qty":5,"price":2000}]'::jsonb,
  whatsapp TEXT NOT NULL DEFAULT '213796028588',
  phone_display TEXT NOT NULL DEFAULT '+213 796 02 85 88',
  instagram TEXT NOT NULL DEFAULT 'https://instagram.com/CALMO_DZ',
  facebook TEXT NOT NULL DEFAULT 'https://facebook.com/CALMO',
  website TEXT NOT NULL DEFAULT 'https://www.calmo.com',
  announcement_ar TEXT NOT NULL DEFAULT 'توصيل إلى 58 ولاية · الدفع عند الاستلام',
  announcement_fr TEXT NOT NULL DEFAULT 'Livraison dans les 58 wilayas · Paiement à la livraison',
  order_note_ar TEXT NOT NULL DEFAULT '',
  order_note_fr TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.site_settings (id) VALUES (1);