
-- Create product_images table for multiple images per product
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Everyone can view product images
CREATE POLICY "Anyone can view product images"
ON public.product_images FOR SELECT TO public
USING (true);

-- Only admins can manage product images
CREATE POLICY "Admins can insert product images"
ON public.product_images FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
ON public.product_images FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
ON public.product_images FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
