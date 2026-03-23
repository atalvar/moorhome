
CREATE OR REPLACE FUNCTION public.create_reservation(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_address text DEFAULT NULL::text,
  p_items jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_reservation_id uuid;
  v_product_id uuid;
  v_item jsonb;
  v_updated_count int;
BEGIN
  -- Input validation
  IF length(p_customer_name) < 1 OR length(p_customer_name) > 200 THEN
    RAISE EXCEPTION 'Customer name must be between 1 and 200 characters';
  END IF;

  IF length(p_customer_email) > 254 OR p_customer_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format or too long';
  END IF;

  IF length(p_customer_phone) < 5 OR length(p_customer_phone) > 50 THEN
    RAISE EXCEPTION 'Phone must be between 5 and 50 characters';
  END IF;

  IF p_customer_address IS NOT NULL AND length(p_customer_address) > 500 THEN
    RAISE EXCEPTION 'Address must be under 500 characters';
  END IF;

  IF jsonb_array_length(p_items) = 0 OR jsonb_array_length(p_items) > 20 THEN
    RAISE EXCEPTION 'Item count must be between 1 and 20';
  END IF;

  -- Atomically mark all products as reserved
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
$function$;

-- Revoke anon access to the function
REVOKE EXECUTE ON FUNCTION public.create_reservation FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_reservation FROM public;

-- Add column constraints for defense-in-depth
ALTER TABLE reservations
  ADD CONSTRAINT chk_customer_name_length CHECK (char_length(customer_name) <= 200),
  ADD CONSTRAINT chk_customer_email_length CHECK (char_length(customer_email) <= 254),
  ADD CONSTRAINT chk_customer_phone_length CHECK (char_length(customer_phone) <= 50),
  ADD CONSTRAINT chk_customer_address_length CHECK (customer_address IS NULL OR char_length(customer_address) <= 500);
