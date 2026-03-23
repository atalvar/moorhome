-- Allow admins to delete reservations
CREATE POLICY "Admins can delete reservations" ON public.reservations FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update reservations  
CREATE POLICY "Admins can update reservations" ON public.reservations FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));