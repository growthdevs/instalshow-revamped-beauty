CREATE POLICY "Expositors view own sales by cnpj"
ON public.sales
FOR SELECT
TO authenticated
USING (
  cnpj IN (SELECT cnpj FROM public.expositor_profiles WHERE id = auth.uid())
);