
UPDATE public.sales SET status = 'contrato_assinado' WHERE id IN ('dc0811f8-6c5e-40e6-9a71-16f0658837f5','afe53d02-23f0-4182-9da1-90b9c22d95fc','216fc032-2162-41a8-858b-2c934c60ddf5','1fadc562-52aa-44f4-bc35-c37d7535feb4');
UPDATE public.sales SET status = 'em_analise' WHERE id IN ('c13a1d84-2764-448d-854d-354d4517ee4f','1c8d9090-b54e-4635-a5f3-89761b18baf7','88be97e8-bda6-4c05-ab1d-d77cb6a5b44a');
UPDATE public.sales SET status = 'rejeitado', rejection_reason = 'Cliente desistiu da negociação por questões orçamentárias.' WHERE id = '61e1de39-560b-48bc-88ce-40a78d2b8364';
UPDATE public.sales SET status = 'rejeitado', rejection_reason = 'Stand solicitado já reservado por outro expositor.' WHERE id = 'a8aaead0-9001-4950-ae3a-c43a759c239e';
