
CREATE TABLE public.expositor_profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.expositor_profiles TO authenticated;
GRANT ALL ON public.expositor_profiles TO service_role;

ALTER TABLE public.expositor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expositors can view own profile"
  ON public.expositor_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Expositors can insert own profile"
  ON public.expositor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Expositors can update own profile"
  ON public.expositor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_expositor_profiles_updated_at
  BEFORE UPDATE ON public.expositor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_expositor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.raw_user_meta_data ? 'company_name' AND NEW.raw_user_meta_data ? 'cnpj' THEN
    INSERT INTO public.expositor_profiles (id, company_name, cnpj, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'company_name',
      NEW.raw_user_meta_data ->> 'cnpj',
      NEW.email
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_expositor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_expositor();
