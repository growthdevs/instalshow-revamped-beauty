// Admin management edge function - list/update expositor accounts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, PATCH, POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  if (!token) return json({ error: "Não autenticado" }, 401);

  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData.user) return json({ error: "Sessão inválida" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: isAdmin } = await admin.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (!isAdmin) return json({ error: "Acesso negado" }, 403);

  try {
    if (req.method === "GET") {
      const { data: profiles, error } = await admin
        .from("expositor_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const items = await Promise.all(
        (profiles ?? []).map(async (p) => {
          const { data } = await admin.auth.admin.getUserById(p.id);
          return {
            ...p,
            email: data.user?.email ?? p.email,
            email_verified: !!data.user?.email_confirmed_at,
            last_sign_in_at: data.user?.last_sign_in_at ?? null,
          };
        }),
      );
      return json({ items });
    }

    const body = await req.json().catch(() => ({}));

    if (req.method === "PATCH") {
      const { id, email, phone, company_name, responsible_name } = body;
      if (!id) return json({ error: "ID obrigatório" }, 400);

      if (email) {
        const { error } = await admin.auth.admin.updateUserById(id, { email });
        if (error) return json({ error: error.message }, 400);
      }

      const patch: Record<string, unknown> = {};
      if (email !== undefined) patch.email = email;
      if (phone !== undefined) patch.phone = phone;
      if (company_name !== undefined) patch.company_name = company_name;
      if (responsible_name !== undefined) patch.responsible_name = responsible_name;
      if (Object.keys(patch).length) {
        const { error } = await admin.from("expositor_profiles").update(patch).eq("id", id);
        if (error) return json({ error: error.message }, 400);
      }
      return json({ ok: true });
    }

    if (req.method === "POST") {
      const { id, action } = body;
      if (!id) return json({ error: "ID obrigatório" }, 400);
      if (action !== "verify_email") return json({ error: "Ação inválida" }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Método não suportado" }, 405);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
