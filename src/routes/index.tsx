import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FACTS, T, type Lang } from "@/i18n/content";
import { PRICE_T } from "@/i18n/pricing";
import { OrderForm } from "@/components/OrderForm";
import { Reviews } from "@/components/Reviews";
import { getSiteData } from "@/lib/site.functions";
import { money, unitPrice } from "@/lib/settings";

export const Route = createFileRoute("/")({
  loader: () => getSiteData(),
  head: () => ({
    meta: [
      { title: "CALMO | شاي الأعشاب الفاخر — صناعة جزائرية" },
      {
        name: "description",
        content:
          "شاي CALMO بالأعشاب الطبيعية: يهدّئ الجهاز العصبي ويريح الجهاز الهضمي. 20 كيسًا، بدون كافيين، صناعة جزائرية. اطلب الآن عبر واتساب.",
      },
      { property: "og:title", content: "CALMO | شاي الأعشاب الفاخر — صناعة جزائرية" },
      {
        property: "og:description",
        content:
          "خلطة أعشاب طبيعية تهدّئ الأعصاب وتريح المعدة والقولون. 20 كيسًا · بدون كافيين · صناعة جزائرية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WA_ICON = (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const BAG_ICON = (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

function Index() {
  const { settings, reviews } = Route.useLoaderData();
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const saved = window.localStorage.getItem("calmo-lang");
    if (saved === "fr") setLang("fr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = T[lang].htmlLang;
    document.documentElement.dir = T[lang].dir;
    window.localStorage.setItem("calmo-lang", lang);
  }, [lang]);

  const t = T[lang];
  const p = PRICE_T[lang];
  const toggle = () => setLang((l) => (l === "ar" ? "fr" : "ar"));
  const wa = (msg?: string) =>
    `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg ?? t.waMessage)}`;
  const announcement = lang === "ar" ? settings.announcement_ar : settings.announcement_fr;
  const tiers = [...(settings.bulk_tiers ?? [])].sort((a, b) => a.qty - b.qty);

  return (
    <div dir={t.dir} lang={t.htmlLang} className="bg-night text-white">
      {announcement && (
        <div className="bg-gold px-4 py-2 text-center text-xs font-black uppercase tracking-widest text-night">
          {announcement}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-white/5 bg-night/85 backdrop-blur-xl">
        <nav
          aria-label={lang === "ar" ? "التنقل الرئيسي" : "Navigation principale"}
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"
        >
          <a href="#" className="text-3xl font-black tracking-tighter text-gold">
            {FACTS.name}
          </a>
          <ul className="hidden list-none items-center gap-10 text-[13px] font-bold tracking-wide lg:flex">
            {[
              ["about", t.nav.about],
              ["benefits", t.nav.benefits],
              ["usage", t.nav.usage],
              ["reviews", t.nav.reviews],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="transition-colors hover:text-gold">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <button
              onClick={toggle}
              aria-label={lang === "ar" ? "Passer au français" : "التبديل إلى العربية"}
              className="text-sm font-bold text-white/50 transition-colors hover:text-white"
            >
              {lang === "ar" ? "FR" : "عربي"}
            </button>
            <a
              href="#order"
              className="rounded-sm bg-gold px-6 py-2.5 text-xs font-black uppercase text-night shadow-lg shadow-gold/10 transition-all hover:brightness-110"
            >
              {t.nav.order}
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-12">
          <div className="z-10 lg:col-span-7">
            {settings.show_prices && (
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-black text-gold">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                {money(unitPrice(settings, 1), lang, settings)} — {t.hero.badge}
              </div>
            )}
            <h1 className="mb-10 font-display text-5xl font-bold leading-[1.15] md:text-7xl">
              {t.hero.titleA}
              <br />
              <span className="text-gold">{t.hero.titleB}</span>
            </h1>
            <p className="mb-12 max-w-xl text-lg leading-relaxed text-white/60">{t.hero.lede}</p>
            <div className="flex flex-wrap gap-5">
              <a
                href="#order"
                className="flex items-center gap-3 rounded-sm bg-gold px-10 py-5 text-lg font-black text-night transition-all hover:-translate-y-0.5"
              >
                <span>{t.hero.cta}</span>
                {BAG_ICON}
              </a>
              <a
                href={wa()}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 rounded-sm border-2 border-white/10 px-10 py-5 text-lg font-bold transition-all hover:bg-white/5"
              >
                {WA_ICON}
                <span>{t.hero.whatsapp}</span>
              </a>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="absolute -inset-10 rounded-full bg-gold/5 blur-[120px]" aria-hidden />
            <div className="relative rotate-2 overflow-hidden rounded-[40px] border border-white/10 shadow-2xl">
              <img
                src="/hero-desert.jpg"
                alt={
                  lang === "ar"
                    ? "شاي CALMO في أجواء صحراوية عند الغروب"
                    : "Thé CALMO dans une ambiance désertique au coucher du soleil"
                }
                className="h-[420px] w-full object-cover md:h-[560px]"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-56 -rotate-3 rounded-2xl border border-white/5 bg-night2 p-3 shadow-2xl sm:block md:-right-8 md:w-64">
              <img
                src="/box-front.jpg"
                alt={
                  lang === "ar"
                    ? "علبة شاي CALMO — 20 كيسًا"
                    : "Boîte de thé CALMO — 20 sachets"
                }
                loading="lazy"
                className="h-40 w-full rounded-xl object-cover md:h-48"
              />
            </div>
          </div>
        </section>

        {/* ABOUT + FEATURES */}
        <section id="about" className="reveal mx-auto max-w-7xl border-t border-white/5 px-6 py-24 md:py-32">
          <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
            <div className="max-w-xl">
              <h2 className="mb-6 font-display text-4xl font-bold leading-snug md:text-5xl">
                {t.about.title}
              </h2>
              <p className="leading-relaxed text-white/60">{t.about.body}</p>
            </div>
            <div className="hidden font-sans text-8xl font-black leading-none text-white/5 lg:block" aria-hidden>
              CALMO
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 md:grid-cols-3">
            {[
              [
                <svg key="i1" className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>,
                t.about.p1t,
                t.about.p1d,
              ],
              [
                <svg key="i2" className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
                t.about.p2t,
                t.about.p2d,
              ],
              [
                <svg key="i3" className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                t.about.p3t,
                t.about.p3d,
              ],
            ].map(([icon, title, desc]) => (
              <article
                key={title as string}
                className="group bg-night2 p-10 transition-colors hover:bg-night3 md:p-12"
              >
                <div className="mb-8 h-12 w-12 text-gold transition-transform group-hover:scale-110">
                  {icon}
                </div>
                <h3 className="mb-4 text-xl font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section id="benefits" className="reveal border-y border-white/5 bg-night3 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
              <div className="max-w-xl">
                <h2 className="mb-4 font-display text-4xl font-bold leading-snug md:text-5xl">
                  {t.benefits.title}
                </h2>
                <p className="text-white/50">{t.benefits.sub}</p>
              </div>
              <div className="hidden font-sans text-8xl font-black leading-none text-white/5 lg:block" aria-hidden>
                BENEFITS
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
              {t.benefits.items.map((b) => (
                <article key={b.text} className="flex items-center gap-5 bg-night2 p-8 transition-colors hover:bg-night3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-xl text-gold">
                    {b.icon}
                  </div>
                  <p className="text-lg font-bold text-gold-lt">{b.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <img
                src="/label-benefits.jpg"
                alt={lang === "ar" ? "فوائد CALMO على العبوة" : "Bienfaits sur l'emballage"}
                loading="lazy"
                className="w-full rounded-3xl border border-white/10 object-cover"
              />
              <img
                src="/desert-cup.jpg"
                alt={lang === "ar" ? "كوب شاي CALMO عند الغروب" : "Tasse de thé CALMO au coucher du soleil"}
                loading="lazy"
                className="w-full rounded-3xl border border-white/10 object-cover"
              />
            </div>
          </div>
        </section>

        {/* USAGE */}
        <section id="usage" className="reveal mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mb-16 max-w-xl">
            <h2 className="mb-4 font-display text-4xl font-bold leading-snug md:text-5xl">
              {t.usage.title}
            </h2>
            <p className="text-white/50">{t.usage.sub}</p>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.usage.steps.map((s, i) => (
              <li key={s.t} className="space-y-3 text-center">
                <div className="-mb-8 text-6xl font-black text-gold/15" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="relative z-10 text-3xl">{s.icon}</div>
                <h3 className="relative z-10 text-xl font-bold">{s.t}</h3>
                <p className="relative z-10 px-4 text-sm text-white/50">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-white/70">
            📦 {t.usage.storage}
          </p>

          <div className="mt-6 rounded-2xl border border-gold/30 bg-night2 p-6 md:p-8">
            <h3 className="text-lg font-black text-gold">⚠️ {t.warnings.title}</h3>
            <ul className="mt-3 list-disc space-y-1.5 ps-5 text-white/70">
              {t.warnings.items.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* PRICING */}
        {settings.show_prices && (
          <section className="reveal border-y border-white/5 bg-night3 py-24 md:py-32">
            <div className="mx-auto max-w-4xl px-6">
              <div className="mb-14 text-center">
                <h2 className="mb-3 font-display text-4xl font-bold md:text-5xl">{p.priceTitle}</h2>
                <p className="text-white/50">
                  {p.delivery}: {money(settings.delivery_da, lang, settings)}
                </p>
              </div>
              <div className="relative rounded-[40px] bg-gold p-10 text-center text-night shadow-[0_40px_100px_rgba(197,160,89,0.15)] md:p-14">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-night px-6 py-2 text-[10px] font-black uppercase tracking-tighter text-gold">
                  {lang === "ar" ? "الدفع عند الاستلام" : "Paiement à la livraison"}
                </div>
                <h3 className="mb-2 text-3xl font-black">{lang === "ar" ? "علبة واحدة — 20 كيسًا" : "1 boîte — 20 sachets"}</h3>
                <div className="mb-2 text-5xl font-black">
                  {money(settings.price_da, lang, settings)}
                </div>
                <p className="mb-8 text-sm font-bold text-night/60">{p.perBox}</p>
                {tiers.length > 0 && (
                  <ul className="mx-auto mb-10 grid max-w-md gap-3">
                    {tiers.map((tier) => (
                      <li
                        key={tier.qty}
                        className="flex items-center justify-between rounded-2xl bg-night/10 px-5 py-3 font-bold"
                      >
                        <span>{p.bulkRow(tier.qty)}</span>
                        <span className="font-black">
                          {money(tier.price, lang, settings)} / {p.perBox}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href="#order"
                  className="inline-block w-full rounded-2xl bg-night py-5 text-lg font-black text-white transition-all hover:brightness-125"
                >
                  {t.hero.cta}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* REVIEWS */}
        <section id="reviews" className="reveal mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mb-14 max-w-xl">
            <h2 className="mb-4 font-display text-4xl font-bold leading-snug md:text-5xl">
              {t.reviews.title}
            </h2>
            <p className="text-white/50">{t.reviews.sub}</p>
          </div>
          <Reviews t={t} lang={lang} reviews={reviews} />
        </section>

        {/* ORDER */}
        <section id="order" className="reveal mx-auto max-w-3xl px-6 pb-24 md:pb-32">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-display text-4xl font-bold md:text-5xl">{t.order.title}</h2>
            <p className="text-white/50">{t.order.sub}</p>
          </div>
          <OrderForm t={t} lang={lang} settings={settings} />
        </section>
      </main>

      <footer className="border-t border-white/5 px-6 py-20 text-center">
        <div className="mb-6 text-4xl font-black tracking-tighter text-gold">{FACTS.name}</div>
        <p className="mb-8 text-sm text-white/50">{t.footer.tagline}</p>
        <div className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-bold text-white/40">
          <a
            href={`tel:${settings.phone_display.replace(/\s/g, "")}`}
            dir="ltr"
            className="transition-colors hover:text-white"
          >
            {settings.phone_display}
          </a>
          <a href={settings.instagram} target="_blank" rel="noopener" className="transition-colors hover:text-white">
            Instagram
          </a>
          <a href={settings.facebook} target="_blank" rel="noopener" className="transition-colors hover:text-white">
            Facebook
          </a>
          <a href={settings.website} target="_blank" rel="noopener" className="transition-colors hover:text-white">
            {settings.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
          {t.footer.rights} · {t.footer.made}
        </p>
      </footer>

      <a
        href={wa()}
        target="_blank"
        rel="noopener"
        aria-label={t.hero.whatsapp}
        className="fixed bottom-8 z-50 grid h-16 w-16 place-items-center rounded-full bg-wa text-white shadow-[0_20px_40px_rgba(37,211,102,0.3)] transition-transform hover:scale-110 ltr:right-8 rtl:left-8"
      >
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.633 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
