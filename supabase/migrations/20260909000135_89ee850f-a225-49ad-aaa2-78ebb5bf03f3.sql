GRANT SELECT ON public.services TO anon;
GRANT INSERT ON public.bookings TO anon;

ALTER FUNCTION public.available_slots(date, integer) SECURITY DEFINER;
GRANT EXECUTE ON FUNCTION public.available_slots(date, integer) TO anon;

DROP POLICY IF EXISTS "Anon can view active public services" ON public.services;
CREATE POLICY "Anon can view active public services" ON public.services
FOR SELECT TO anon
USING (active = true AND vip_only = false);

DROP POLICY IF EXISTS "Anon can create booking" ON public.bookings;
CREATE POLICY "Anon can create booking" ON public.bookings
FOR INSERT TO anon
WITH CHECK (user_id IS NULL);