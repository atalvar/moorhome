CREATE TABLE public.reservation_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reservation_attempts ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_reservation_attempts_ip_created ON public.reservation_attempts (ip_address, created_at);