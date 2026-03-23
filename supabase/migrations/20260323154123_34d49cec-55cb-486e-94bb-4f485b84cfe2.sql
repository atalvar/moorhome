CREATE OR REPLACE FUNCTION public.check_rate_limit(p_ip text, p_window_minutes int DEFAULT 1, p_max_attempts int DEFAULT 5)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_count int;
BEGIN
  -- Clean old entries
  DELETE FROM reservation_attempts WHERE created_at < now() - (p_window_minutes || ' minutes')::interval;
  
  -- Count recent attempts
  SELECT count(*) INTO v_count
  FROM reservation_attempts
  WHERE ip_address = p_ip
    AND created_at > now() - (p_window_minutes || ' minutes')::interval;
  
  IF v_count >= p_max_attempts THEN
    RETURN true; -- rate limited
  END IF;
  
  -- Log this attempt
  INSERT INTO reservation_attempts (ip_address) VALUES (p_ip);
  
  RETURN false;
END;
$$;