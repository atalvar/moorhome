
-- 1. Drop public INSERT policies (RPC is SECURITY DEFINER, bypasses RLS)
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can create reservation items" ON public.reservation_items;

-- 2. Fix race condition in create_reservation: atomic check+update
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
  v_updated_count int;
BEGIN
  -- Atomically mark all products as reserved (check + update in one step)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;

    UPDATE products
      SET is_reserved = true
      WHERE id = v_product_id
        AND is_reserved = false;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    IF v_updated_count = 0 THEN
      RAISE EXCEPTION 'Product % is already reserved', v_product_id;
    END IF;
  END LOOP;

  -- Create reservation
  INSERT INTO reservations (customer_name, customer_email, customer_phone, customer_address)
  VALUES (p_customer_name, p_customer_email, p_customer_phone, p_customer_address)
  RETURNING id INTO v_reservation_id;

  -- Create reservation items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;

    INSERT INTO reservation_items (reservation_id, product_id, delivery_method)
    VALUES (v_reservation_id, v_product_id, COALESCE(v_item->>'delivery_method', 'pickup'));
  END LOOP;

  RETURN v_reservation_id;
END;
$$;
