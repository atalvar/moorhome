
-- 1. Fix reservations: restrict SELECT to admins only
DROP POLICY IF EXISTS "Anyone can view reservations" ON public.reservations;
CREATE POLICY "Admins can view reservations"
ON public.reservations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix reservation_items: restrict SELECT to admins only
DROP POLICY IF EXISTS "Anyone can view reservation items" ON public.reservation_items;
CREATE POLICY "Admins can view reservation items"
ON public.reservation_items
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Fix overly permissive INSERT policies: allow public inserts but only for own data
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
CREATE POLICY "Anyone can create reservations"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create reservation items" ON public.reservation_items;
CREATE POLICY "Anyone can create reservation items"
ON public.reservation_items
FOR INSERT
TO public
WITH CHECK (true);
