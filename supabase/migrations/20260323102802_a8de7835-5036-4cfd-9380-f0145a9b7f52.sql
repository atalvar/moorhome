
-- 1. Create atomic reservation RPC (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.create_reservation(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_address text DEFAULT NULL,
  p_items jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reservation_id uuid;
  v_product_id uuid;
  v_item jsonb;
  v_all_available boolean := true;
BEGIN
  -- Check all products are available (not already reserved)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    IF NOT EXISTS (
      SELECT 1 FROM products WHERE id = v_product_id AND is_reserved = false
    ) THEN
      v_all_available := false;
    END IF;
  END LOOP;

  IF NOT v_all_available THEN
    RAISE EXCEPTION 'One or more products are already reserved';
  END IF;

  -- Create reservation
  INSERT INTO reservations (customer_name, customer_email, customer_phone, customer_address)
  VALUES (p_customer_name, p_customer_email, p_customer_phone, p_customer_address)
  RETURNING id INTO v_reservation_id;

  -- Create items and mark products reserved
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    
    INSERT INTO reservation_items (reservation_id, product_id, delivery_method)
    VALUES (v_reservation_id, v_product_id, COALESCE(v_item->>'delivery_method', 'pickup'));

    UPDATE products SET is_reserved = true WHERE id = v_product_id;
  END LOOP;

  RETURN v_reservation_id;
END;
$$;

-- 2. Fix storage policies: restrict to admin only
DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'admin')
);
