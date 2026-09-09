import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminLoad,
  adminLogin,
  adminLogout,
  adminOrderAction,
  adminReviewAction,
  adminSaveSettings,
} from "@/lib/admin.functions";
import { DEFAULT_SETTINGS, type BulkTier, type SiteSettings } from "@/lib/settings";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "لوحة تحكم CALMO" },
      { name: "description", content: "لوحة تحكم خاصة لإدارة أسعار ومحتوى موقع CALMO." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "لوحة تحكم CALMO" },
      { property: "og:description", content: "إدارة الأسعار والطلبات والآراء." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

type Row = Record<string, any>;

const box = "rounded-2xl border border-line bg-card p-6";
const input =
  "w-full rounded-xl border border-line bg-sand px-4 py-2.5 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
const btn =
  "rounded-full bg-gold px-6 py-2.5 font-extrabold text-night transition-transform hover:-translate-y-0.5 disabled:opacity-60";
const chip =
  "rounded-full border border-line px-3 py-1 text-sm font-bold text-gold-ink hover:bg-sand2";

function Admin() {
  const load = useServerFn(adminLoad);
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const save = useServerFn(adminSaveSettings);
  const reviewAction = useServerFn(adminReviewAction);
  const orderAction = useServerFn(adminOrderAction);

  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [reviews, setReviews] = useState<Row[]>([]);
  const [orders, setOrders] = useState<Row[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"settings" | "orders" | "reviews">("settings");

  async function refresh() {
    const res: any = await load();
    setUnlocked(Boolean(res.unlocked));
    if (res.unlocked) {
      setSettings({ ...DEFAULT_SETTINGS, ...(res.settings ?? {}) });
      setReviews(res.reviews ?? []);
      setOrders(res.orders ?? []);
    }
    setReady(true);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(false);
    const res: any = await login({ data: { password } });
    if (res.ok) {
      setPassword("");
      await refresh();
    } else setLoginError(true);
  }

  async function onSave() {
    setSaving(true);
    setSaved(false);
    await save({
      data: {
        price_da: Number(settings.price_da),
        delivery_da: Number(settings.delivery_da),
        currency_ar: settings.currency_ar,
        currency_fr: settings.currency_fr,
        show_prices: settings.show_prices,
        bulk_tiers: (settings.bulk_tiers ?? [])
          .map((t) => ({ qty: Number(t.qty), price: Number(t.price) }))
          .filter((t) => t.qty > 1 && t.price > 0),
        whatsapp: settings.whatsapp.replace(/[^0-9]/g, ""),
        phone_display: settings.phone_display,
        instagram: settings.instagram,
        facebook: settings.facebook,
        website: settings.website,
        announcement_ar: settings.announcement_ar,
        announcement_fr: settings.announcement_fr,
        order_note_ar: settings.order_note_ar,
        order_note_fr: settings.order_note_fr,
      },
    });
    setSaving(false);
    setSaved(true);
  }

  const set = (patch: Partial<SiteSettings>) => setSettings((s) => ({ ...s, ...patch }));
  const setTier = (i: number, patch: Partial<BulkTier>) =>
    setSettings((s) => {
      const tiers = [...(s.bulk_tiers ?? [])];
      tiers[i] = { ...tiers[i], ...patch } as BulkTier;
      return { ...s, bulk_tiers: tiers };
    });

  if (!ready) {
    return (
      <div dir="rtl" className="grid min-h-screen place-items-center bg-sand text-ink">
        …
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div dir="rtl" className="grid min-h-screen place-items-center bg-night px-5">
        <form onSubmit={onLogin} className="w-full max-w-sm rounded-3xl border border-gold/30 bg-night2 p-8">
          <h1 className="text-2xl font-extrabold text-gold-lt">لوحة تحكم CALMO</h1>
          <p className="mt-2 text-sm text-white/70">أدخل كلمة المرور للدخول.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="mt-5 w-full rounded-xl border border-white/15 bg-night px-4 py-3 text-white outline-none focus:border-gold"
          />
          {loginError && (
            <p role="alert" className="mt-2 text-sm font-bold text-gold-lt">
              كلمة المرور غير صحيحة
            </p>
          )}
          <button type="submit" className={`${btn} mt-5 w-full`}>
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-sand text-ink">
      <header className="border-b border-line bg-night px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold tracking-widest text-gold-lt">
            CALMO · لوحة التحكم
          </h1>
          <div className="flex gap-2">
            <a href="/" className="rounded-full border border-gold/40 px-4 py-1.5 text-sm font-bold text-gold-lt">
              الموقع
            </a>
            <button
              onClick={async () => {
                await logout();
                await refresh();
              }}
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-bold text-white/80"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {([
            ["settings", "الأسعار والمعلومات"],
            ["orders", `الطلبات (${orders.length})`],
            ["reviews", `الآراء (${reviews.length})`],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-5 py-2 text-sm font-bold ${
                tab === id ? "bg-gold text-night" : "border border-line bg-card text-gold-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "settings" && (
          <div className="grid gap-6">
            <section className={box}>
              <h2 className="mb-4 text-lg font-extrabold text-gold-ink">الأسعار</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-bold">سعر العلبة</span>
                  <input
                    type="number"
                    value={settings.price_da}
                    onChange={(e) => set({ price_da: Number(e.target.value) })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">سعر التوصيل</span>
                  <input
                    type="number"
                    value={settings.delivery_da}
                    onChange={(e) => set({ delivery_da: Number(e.target.value) })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">العملة (عربي)</span>
                  <input
                    value={settings.currency_ar}
                    onChange={(e) => set({ currency_ar: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">العملة (فرنسي)</span>
                  <input
                    value={settings.currency_fr}
                    onChange={(e) => set({ currency_fr: e.target.value })}
                    className={input}
                  />
                </label>
              </div>
              <label className="mt-4 flex items-center gap-3 font-bold">
                <input
                  type="checkbox"
                  checked={settings.show_prices}
                  onChange={(e) => set({ show_prices: e.target.checked })}
                  className="h-5 w-5 accent-gold"
                />
                إظهار الأسعار في الموقع
              </label>
            </section>

            <section className={box}>
              <h2 className="mb-1 text-lg font-extrabold text-gold-ink">تخفيضات حسب الكمية</h2>
              <p className="mb-4 text-sm text-ink/70">
                سعر العلبة الواحدة عند شراء كمية معيّنة فأكثر.
              </p>
              <div className="grid gap-3">
                {(settings.bulk_tiers ?? []).map((tier, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-3">
                    <label className="grow">
                      <span className="mb-1 block text-sm font-bold">ابتداءً من (علب)</span>
                      <input
                        type="number"
                        value={tier.qty}
                        onChange={(e) => setTier(i, { qty: Number(e.target.value) })}
                        className={input}
                      />
                    </label>
                    <label className="grow">
                      <span className="mb-1 block text-sm font-bold">سعر العلبة</span>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => setTier(i, { price: Number(e.target.value) })}
                        className={input}
                      />
                    </label>
                    <button
                      onClick={() =>
                        set({ bulk_tiers: settings.bulk_tiers.filter((_, j) => j !== i) })
                      }
                      className={chip}
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() =>
                  set({
                    bulk_tiers: [
                      ...(settings.bulk_tiers ?? []),
                      { qty: 2, price: Number(settings.price_da) },
                    ],
                  })
                }
                className={`${chip} mt-4`}
              >
                + إضافة تخفيض
              </button>
            </section>

            <section className={box}>
              <h2 className="mb-4 text-lg font-extrabold text-gold-ink">التواصل</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-bold">رقم واتساب (بدون +)</span>
                  <input
                    dir="ltr"
                    value={settings.whatsapp}
                    onChange={(e) => set({ whatsapp: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">الهاتف المعروض</span>
                  <input
                    dir="ltr"
                    value={settings.phone_display}
                    onChange={(e) => set({ phone_display: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">إنستغرام</span>
                  <input
                    dir="ltr"
                    value={settings.instagram}
                    onChange={(e) => set({ instagram: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">فيسبوك</span>
                  <input
                    dir="ltr"
                    value={settings.facebook}
                    onChange={(e) => set({ facebook: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block font-bold">الموقع الإلكتروني</span>
                  <input
                    dir="ltr"
                    value={settings.website}
                    onChange={(e) => set({ website: e.target.value })}
                    className={input}
                  />
                </label>
              </div>
            </section>

            <section className={box}>
              <h2 className="mb-4 text-lg font-extrabold text-gold-ink">النصوص</h2>
              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-1 block font-bold">شريط الإعلان (عربي)</span>
                  <input
                    value={settings.announcement_ar}
                    onChange={(e) => set({ announcement_ar: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">شريط الإعلان (فرنسي)</span>
                  <input
                    dir="ltr"
                    value={settings.announcement_fr}
                    onChange={(e) => set({ announcement_fr: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">ملاحظة أسفل الطلب (عربي)</span>
                  <input
                    value={settings.order_note_ar}
                    onChange={(e) => set({ order_note_ar: e.target.value })}
                    className={input}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-bold">ملاحظة أسفل الطلب (فرنسي)</span>
                  <input
                    dir="ltr"
                    value={settings.order_note_fr}
                    onChange={(e) => set({ order_note_fr: e.target.value })}
                    className={input}
                  />
                </label>
              </div>
            </section>

            <div className="sticky bottom-4 flex items-center gap-4 rounded-2xl border border-line bg-card p-4">
              <button onClick={onSave} disabled={saving} className={btn}>
                {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
              </button>
              {saved && <span className="font-bold text-gold-ink">تم الحفظ ✓</span>}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <section className={box}>
            <h2 className="mb-4 text-lg font-extrabold text-gold-ink">الطلبات</h2>
            {orders.length === 0 ? (
              <p className="text-ink/70">لا توجد طلبات بعد.</p>
            ) : (
              <ul className="grid gap-3">
                {orders.map((o) => (
                  <li key={o.id} className="rounded-xl border border-line bg-sand p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-extrabold">
                        {o.name} — <span dir="ltr">{o.phone}</span>
                      </p>
                      <span className="text-sm text-ink/60">
                        {new Date(o.created_at).toLocaleString("fr-DZ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">
                      {o.wilaya} · {o.qty} علبة · {Math.round(Number(o.total_da))} {settings.currency_ar}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["new", "confirmed", "delivered"].map((s) => (
                        <button
                          key={s}
                          onClick={async () => {
                            await orderAction({ data: { id: o.id, status: s } });
                            await refresh();
                          }}
                          className={`${chip} ${o.status === s ? "bg-gold text-night" : ""}`}
                        >
                          {s === "new" ? "جديد" : s === "confirmed" ? "مؤكد" : "تم التسليم"}
                        </button>
                      ))}
                      <button
                        onClick={async () => {
                          await orderAction({ data: { id: o.id, delete: true } });
                          await refresh();
                        }}
                        className={chip}
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "reviews" && (
          <section className={box}>
            <h2 className="mb-4 text-lg font-extrabold text-gold-ink">الآراء</h2>
            {reviews.length === 0 ? (
              <p className="text-ink/70">لا توجد آراء بعد.</p>
            ) : (
              <ul className="grid gap-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-line bg-sand p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-extrabold">
                        {r.name} · {"★".repeat(r.rating)}
                      </p>
                      <span className={`text-sm font-bold ${r.approved ? "text-wa" : "text-gold-ink"}`}>
                        {r.approved ? "منشور" : "بانتظار الموافقة"}
                      </span>
                    </div>
                    <p className="mt-2">{r.text}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={async () => {
                          await reviewAction({
                            data: { id: r.id, action: r.approved ? "hide" : "approve" },
                          });
                          await refresh();
                        }}
                        className={chip}
                      >
                        {r.approved ? "إخفاء" : "نشر"}
                      </button>
                      <button
                        onClick={async () => {
                          await reviewAction({ data: { id: r.id, action: "delete" } });
                          await refresh();
                        }}
                        className={chip}
                      >
                        حذف
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
