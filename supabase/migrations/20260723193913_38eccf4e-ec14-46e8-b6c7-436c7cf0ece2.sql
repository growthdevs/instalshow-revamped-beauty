
CREATE TYPE public.sale_status AS ENUM ('em_analise', 'aguardando_assinatura', 'contrato_assinado', 'rejeitado');

ALTER TABLE public.sales
  ADD COLUMN status public.sale_status NOT NULL DEFAULT 'aguardando_assinatura',
  ADD COLUMN rejection_reason text;
