// Admin management edge function - CRUD for admin users
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
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
      const { data: roles, error: rolesErr } = await admin
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "admin");
      if (rolesErr) throw rolesErr;

      const items = await Promise.all(
        (roles ?? []).map(async (r) => {
          const { data } = await admin.auth.admin.getUserById(r.user_id);
          const meta = (data.user?.user_metadata ?? {}) as Record<string, string>;
          return {
            id: r.user_id,
            email: data.user?.email ?? "",
            name: meta.name ?? "",
            phone: meta.phone ?? "",
            cpf: meta.cpf ?? "",
            created_at: data.user?.created_at ?? r.created_at,
            last_sign_in_at: data.user?.last_sign_in_at ?? null,
          };
        }),
      );
      return json({ items });
    }

    const body = await req.json().catch(() => ({}));

    if (req.method === "POST") {
      const { email, password, name, phone, cpf } = body;
      if (!email || !password || String(password).length < 6) {
        return json({ error: "E-mail e senha (mín. 6 caracteres) são obrigatórios" }, 400);
      }
      if (!name || !phone || !cpf) {
        return json({ error: "Nome, celular e CPF são obrigatórios" }, 400);
      }
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, phone, cpf },
      });
      if (createErr) return json({ error: createErr.message }, 400);
      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: created.user!.id, role: "admin" });
      if (roleErr) {
        await admin.auth.admin.deleteUser(created.user!.id);
        return json({ error: roleErr.message }, 400);
      }
      return json({ id: created.user!.id });
    }

    if (req.method === "PATCH") {
      const { id, email, password, name, phone, cpf } = body;
      if (!id) return json({ error: "ID obrigatório" }, 400);
      const attrs: Record<string, unknown> = {};
      if (email) attrs.email = email;
      if (password) {
        if (String(password).length < 6) return json({ error: "Senha muito curta" }, 400);
        attrs.password = password;
      }
      const meta: Record<string, string> = {};
      if (name !== undefined) meta.name = name;
      if (phone !== undefined) meta.phone = phone;
      if (cpf !== undefined) meta.cpf = cpf;
      if (Object.keys(meta).length) {
        const { data: existing } = await admin.auth.admin.getUserById(id);
        attrs.user_metadata = { ...(existing.user?.user_metadata ?? {}), ...meta };
      }
      if (!Object.keys(attrs).length) return json({ error: "Nada para atualizar" }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, attrs);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { id } = body;
      if (!id) return json({ error: "ID obrigatório" }, 400);
      if (id === userData.user.id) return json({ error: "Você não pode excluir a si mesmo" }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Método não suportado" }, 405);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
