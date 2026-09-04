ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'atendimento',
  ADD COLUMN IF NOT EXISTS checkout_url text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pendente',
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS amount_cents integer NOT NULL DEFAULT 0;

INSERT INTO public.services (name, duration_min, price_cents, description, sort_order, active, kind)
SELECT 'Call de Mentoria — Individual', 45, 0, 'Sessão de mentoria individual online com a Josi para alunas da mentoria.', 0, true, 'mentoria'
WHERE NOT EXISTS (SELECT 1 FROM public.services WHERE kind = 'mentoria');