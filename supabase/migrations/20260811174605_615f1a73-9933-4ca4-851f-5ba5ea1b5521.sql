DELETE FROM public.stand_parameters WHERE id = 'ouro';
INSERT INTO public.stand_parameters (id, name, price, description, sort_order) VALUES
 ('prata-plus','Prata Plus',15000,'Posição privilegiada, maior visibilidade e fluxo.',3),
 ('outro','Outro',0,'Formato personalizado — valor definido pela equipe comercial.',4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;