import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_SETTINGS, type SiteSettings } from "./settings";

function publicClient() {
  return createClient(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export type PublicReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
};

export const getSiteData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [settingsRes, reviewsRes] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("reviews")
      .select("id,name,rating,text,created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const settings = {
    ...DEFAULT_SETTINGS,
    ...(settingsRes.data ?? {}),
  } as SiteSettings;

  return {
    settings,
    reviews: (reviewsRes.data ?? []) as PublicReview[],
  };
});
