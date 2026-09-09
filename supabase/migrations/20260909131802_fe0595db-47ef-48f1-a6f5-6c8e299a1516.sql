CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'ar',
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (approved = true);

CREATE POLICY "Anyone can submit a review"
ON public.reviews FOR INSERT
TO anon, authenticated
WITH CHECK (approved = false AND char_length(name) BETWEEN 2 AND 60 AND char_length(text) BETWEEN 10 AND 1000 AND rating BETWEEN 1 AND 5);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  total_da NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place an order"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (char_length(name) BETWEEN 2 AND 80 AND char_length(phone) BETWEEN 6 AND 25 AND qty BETWEEN 1 AND 100);