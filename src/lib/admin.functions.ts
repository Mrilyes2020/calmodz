import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import type { SiteSettings } from "./settings";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "calmo-admin",
    maxAge: 60 * 60 * 24 * 7,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("UNAUTHORIZED");
  return session;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) return { ok: false as const };
    if (!matches(String(data.password ?? ""), expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminLoad = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) return { unlocked: false as const };

  const db = await admin();
  const [settings, reviews, orders] = await Promise.all([
    db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    db.from("reviews").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
  ]);

  return {
    unlocked: true as const,
    settings: settings.data,
    reviews: reviews.data ?? [],
    orders: orders.data ?? [],
  };
});

export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator((data: Partial<SiteSettings>) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db
      .from("site_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminReviewAction = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; action: "approve" | "hide" | "delete" }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    if (data.action === "delete") {
      await db.from("reviews").delete().eq("id", data.id);
    } else {
      await db.from("reviews").update({ approved: data.action === "approve" }).eq("id", data.id);
    }
    return { ok: true as const };
  });

export const adminOrderAction = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status?: string; delete?: boolean }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    if (data.delete) await db.from("orders").delete().eq("id", data.id);
    else await db.from("orders").update({ status: data.status ?? "new" }).eq("id", data.id);
    return { ok: true as const };
  });
