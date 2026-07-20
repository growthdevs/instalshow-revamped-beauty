
ALTER TABLE public.expositor_profiles
  ADD COLUMN IF NOT EXISTS responsible_name text,
  ADD COLUMN IF NOT EXISTS phone text;

CREATE OR REPLACE FUNCTION public.handle_new_expositor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.raw_user_meta_data ? 'company_name' AND NEW.raw_user_meta_data ? 'cnpj' THEN
    INSERT INTO public.expositor_profiles (id, company_name, cnpj, email, responsible_name, phone)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'company_name',
      NEW.raw_user_meta_data ->> 'cnpj',
      NEW.email,
      NEW.raw_user_meta_data ->> 'responsible_name',
      NEW.raw_user_meta_data ->> 'phone'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;
