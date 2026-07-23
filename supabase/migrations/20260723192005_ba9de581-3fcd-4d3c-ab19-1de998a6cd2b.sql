
-- Table storing pending simulations submitted by exhibitors, to be recovered by admins via a 6-char code
CREATE OR REPLACE FUNCTION public.generate_simulation_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i int;
  exists_code boolean;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, 1 + floor(random() * length(chars))::int, 1);
    END LOOP;
    SELECT EXISTS (SELECT 1 FROM public.pending_simulations WHERE code = code) INTO exists_code;
    IF NOT exists_code THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

CREATE TABLE public.pending_simulations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  created_by uuid NOT NULL,
  company_name text NOT NULL,
  cnpj text NOT NULL,
  responsible_name text NOT NULL,
  responsible_email text NOT NULL,
  phone text,
  notes text,
  simulation_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.pending_simulations TO authenticated;
GRANT ALL ON public.pending_simulations TO service_role;

ALTER TABLE public.pending_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expositors insert own pending simulation"
  ON public.pending_simulations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owner views own pending simulation"
  ON public.pending_simulations FOR SELECT TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Admins view all pending simulations"
  ON public.pending_simulations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pending_simulations_updated_at
  BEFORE UPDATE ON public.pending_simulations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed mock pending simulations for admin demo (owned by the existing exhibitor test user)
INSERT INTO public.pending_simulations (code, created_by, company_name, cnpj, responsible_name, responsible_email, phone, notes, simulation_data)
SELECT 'DEMO01', ep.id,
  'HidroTech Soluções Ltda', '12.345.678/0001-90', 'Marcos Andrade', ep.email, '(11) 98877-6655',
  'Cliente interessado em fechar 2 stands ouro + palestra principal. Aguardando confirmação de disponibilidade das posições C05 e C06.',
  jsonb_build_object(
    'stands', jsonb_build_array(
      jsonb_build_object('id','ouro','name','Ouro','quantity',2,'unit_price',18500),
      jsonb_build_object('id','prata','name','Prata','quantity',1,'unit_price',12500)
    ),
    'eventos', jsonb_build_array(
      jsonb_build_object('id','palestra-1','name','Palestra Patrocinada — Auditório Principal','price',6500)
    ),
    'desired_stands', 'C05, C06, A12',
    'subtotal', 56000,
    'discount', jsonb_build_object('applied', false, 'percentage', 10, 'value', 0),
    'simulated_total', 56000,
    'negotiated_value', 52000
  )
FROM public.expositor_profiles ep
WHERE ep.email = 'expositor@teste.com.br'
LIMIT 1;

INSERT INTO public.pending_simulations (code, created_by, company_name, cnpj, responsible_name, responsible_email, phone, notes, simulation_data)
SELECT 'DEMO02', ep.id,
  'InstalPro Engenharia', '98.765.432/0001-10', 'Fernanda Lima', ep.email, '(11) 97766-5544',
  'Primeira participação no evento — aplicar desconto de 10%. Cliente pediu descrição detalhada dos serviços da palestra técnica.',
  jsonb_build_object(
    'stands', jsonb_build_array(
      jsonb_build_object('id','bronze','name','Bronze','quantity',3,'unit_price',8500)
    ),
    'eventos', jsonb_build_array(
      jsonb_build_object('id','palestra-2','name','Palestra Técnica — Sala de Workshops','price',3800)
    ),
    'desired_stands', 'B22, B23, B24',
    'subtotal', 29300,
    'discount', jsonb_build_object('applied', true, 'percentage', 10, 'value', 2930),
    'simulated_total', 26370,
    'negotiated_value', 25000
  )
FROM public.expositor_profiles ep
WHERE ep.email = 'expositor@teste.com.br'
LIMIT 1;
