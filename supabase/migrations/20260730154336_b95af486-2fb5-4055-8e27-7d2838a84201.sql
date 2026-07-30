CREATE TABLE public.stand_parameters (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stand_parameters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stand_parameters TO authenticated;
GRANT ALL ON public.stand_parameters TO service_role;
ALTER TABLE public.stand_parameters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view stand parameters" ON public.stand_parameters FOR SELECT USING (true);
CREATE POLICY "Admins manage stand parameters" ON public.stand_parameters FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_stand_parameters_updated_at BEFORE UPDATE ON public.stand_parameters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.simulator_settings (
  id text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.simulator_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.simulator_settings TO authenticated;
GRANT ALL ON public.simulator_settings TO service_role;
ALTER TABLE public.simulator_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view simulator settings" ON public.simulator_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage simulator settings" ON public.simulator_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_simulator_settings_updated_at BEFORE UPDATE ON public.simulator_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.stand_parameters (id, name, price, description, sort_order) VALUES
  ('bronze', 'Bronze', 8500, 'Localização periférica, ótimo custo-benefício.', 1),
  ('prata', 'Prata', 12500, 'Posição intermediária, alto fluxo de público.', 2),
  ('ouro', 'Ouro', 18500, 'Área nobre, ao centro e próxima ao palco.', 3);

INSERT INTO public.simulator_settings (id, title, subtitle) VALUES
  ('stands', 'Seleção de stands', 'Escolha a quantidade de stands por categoria.');

CREATE POLICY "Admins view all expositor profiles" ON public.expositor_profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update expositor profiles" ON public.expositor_profiles FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));