ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS vip boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vip_since date;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS vip_only boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS billing_period text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS meet_url text,
  ADD COLUMN IF NOT EXISTS whatsapp_sent_at timestamptz;

INSERT INTO public.services (name, description, kind, billing_period, duration_min, price_cents, sort_order, active, vip_only)
SELECT v.name, v.description, 'plano', v.billing_period, 60, 0, v.sort_order, true, false
FROM (VALUES
  ('Plano Mensal de Massagens', 'Sessões mensais recorrentes com horários prioritários.', 'mensal', 101),
  ('Plano Trimestral de Massagens', 'Três meses de cuidado contínuo com valor especial.', 'trimestral', 102),
  ('Plano Anual de Massagens', 'Acompanhamento durante o ano todo, com benefícios VIP.', 'anual', 103)
) AS v(name, description, billing_period, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.services s WHERE s.name = v.name);