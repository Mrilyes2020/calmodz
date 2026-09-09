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
    <div dir={t.dir} lang={t.htmlLang} className="bg-sand text-ink">
      {announcement && (
        <div className="bg-gold px-4 py-2 text-center text-sm font-bold text-night">
          {announcement}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-gold/20 bg-night/95 backdrop-blur">
        <nav
          aria-label={lang === "ar" ? "التنقل الرئيسي" : "Navigation principale"}
          className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3"
        >
          <a href="#" className="flex items-center gap-2.5">
            <img
              src="/box-front.jpg"
              alt={FACTS.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-gold/40 object-cover"
            />
            <span className="text-xl font-extrabold tracking-[0.2em] text-gold-lt">
              {FACTS.name}
            </span>
          </a>
          <ul className="hidden list-none gap-5 text-sm font-medium text-white/85 lg:flex">
            {[
              ["about", t.nav.about],
              ["benefits", t.nav.benefits],
              ["usage", t.nav.usage],
              ["reviews", t.nav.reviews],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="hover:text-gold-lt">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={lang === "ar" ? "Passer au français" : "التبديل إلى العربية"}
              className="rounded-full border-2 border-gold px-4 py-1.5 text-sm font-bold text-gold-lt transition-transform hover:-translate-y-0.5"
            >
              {lang === "ar" ? "FR" : "عربي"}
            </button>
            <a
              href="#order"
              className="rounded-full bg-gold px-5 py-2 text-sm font-extrabold text-night transition-transform hover:-translate-y-0.5"
            >
              {t.nav.order}
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <div className="relative overflow-hidden bg-night text-white">
          <img
            src="/hero-desert.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/55 to-night" />
          <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:py-32">
            <p className="mb-5 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm font-bold text-gold-lt">
              {t.hero.badge}
            </p>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-snug md:text-6xl">
              {t.hero.titleA}
              <br />
              <span className="text-gold-lt">{t.hero.titleB}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">{t.hero.lede}</p>

            {settings.show_prices && (
              <p className="mt-7 inline-flex items-baseline gap-2 rounded-2xl border border-gold/40 bg-night2/70 px-6 py-3">
                <span className="text-sm text-white/70">{p.from}</span>
                <span className="text-3xl font-extrabold text-gold-lt">
                  {money(unitPrice(settings, 1), lang, settings)}
                </span>
                <span className="text-sm text-white/70">{p.perBox}</span>
              </p>
            )}

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="#order"
                className="rounded-full bg-gold px-8 py-3.5 text-lg font-extrabold text-night transition-transform hover:-translate-y-0.5"
              >
                🛒 {t.hero.cta}
              </a>
              <a
                href={wa()}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                💬 {t.hero.whatsapp}
              </a>
              <a
                href="#reviews"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3.5 font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                ⭐ {t.hero.reviews}
              </a>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="reveal mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-extrabold text-gold-ink md:text-4xl">{t.about.title}</h2>
          <div className="gold-rule my-4 max-w-xs" aria-hidden>
            <span>◆</span>
          </div>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <p className="text-lg">{t.about.body}</p>
            <img
              src="/box-front.jpg"
              alt={
                lang === "ar"
                  ? "علبة شاي CALMO — 20 كيسًا، شاي بالأعشاب"
                  : "Boîte de thé CALMO — 20 sachets, thé aux plantes"
              }
              loading="lazy"
              className="w-full rounded-3xl border border-line shadow-[0_24px_48px_-18px_rgba(20,16,8,.35)]"
            />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["🌿", t.about.p1t, t.about.p1d],
              ["🌙", t.about.p2t, t.about.p2d],
              ["🇩🇿", t.about.p3t, t.about.p3d],
            ].map(([icon, title, desc]) => (
              <article
                key={title as string}
                className="rounded-2xl border border-line bg-card p-6 shadow-[0_8px_24px_-14px_rgba(20,16,8,.18)]"
              >
                <div className="text-3xl">{icon}</div>
                <h3 className="mb-1 mt-2 text-xl font-bold text-gold-ink">{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section id="benefits" className="reveal bg-night py-16 text-white md:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-extrabold text-gold-lt md:text-4xl">
              {t.benefits.title}
            </h2>
            <p className="mb-10 mt-2 text-white/70">{t.benefits.sub}</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {t.benefits.items.map((b) => (
                <article
                  key={b.text}
                  className="flex items-center gap-4 rounded-2xl border border-gold/25 bg-night2 p-5"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-2xl">
                    {b.icon}
                  </div>
                  <p className="text-lg font-bold text-gold-lt">{b.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <img
                src="/label-benefits.jpg"
                alt={lang === "ar" ? "فوائد CALMO على العبوة" : "Bienfaits sur l'emballage"}
                loading="lazy"
                className="w-full rounded-3xl border border-gold/25 object-cover"
              />
              <img
                src="/desert-cup.jpg"
                alt={lang === "ar" ? "كوب شاي CALMO" : "Tasse de thé CALMO"}
                loading="lazy"
                className="w-full rounded-3xl border border-gold/25 object-cover"
              />
            </div>
          </div>
        </section>

        {/* USAGE */}
        <section id="usage" className="reveal mx-auto max-w-6xl px-5 py-16 md:py-20">
          <h2 className="text-3xl font-extrabold text-gold-ink md:text-4xl">{t.usage.title}</h2>
          <p className="mb-10 mt-2 text-gold-ink/80">{t.usage.sub}</p>
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.usage.steps.map((s, i) => (
              <li
                key={s.t}
                className="relative rounded-2xl border border-line bg-card p-6 pt-8 shadow-[0_8px_24px_-14px_rgba(20,16,8,.18)]"
              >
                <span className="absolute -top-4 start-5 grid h-8 w-8 place-items-center rounded-full bg-gold font-extrabold text-night">
                  {i + 1}
                </span>
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mb-1 mt-2 text-lg font-bold text-gold-ink">{s.t}</h3>
                <p className="text-sm">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-2xl border border-line bg-sand2 p-4 text-sm font-medium">
            📦 {t.usage.storage}
          </p>

          <div className="mt-6 rounded-2xl border border-gold/40 bg-night p-6 text-white">
            <h3 className="text-lg font-extrabold text-gold-lt">⚠️ {t.warnings.title}</h3>
            <ul className="mt-3 list-disc space-y-1.5 ps-5 text-white/85">
              {t.warnings.items.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* PRICING */}
        {settings.show_prices && (
          <section className="reveal mx-auto max-w-4xl px-5 pb-4">
            <div className="rounded-3xl border border-line bg-card p-8 text-center shadow-[0_8px_24px_-14px_rgba(20,16,8,.18)]">
              <h2 className="text-2xl font-extrabold text-gold-ink md:text-3xl">
                {p.priceTitle}
              </h2>
              <p className="mt-3 text-4xl font-extrabold text-gold-ink">
                {money(settings.price_da, lang, settings)}
                <span className="ms-2 text-base font-medium text-ink/70">{p.perBox}</span>
              </p>
              <p className="mt-2 text-sm text-ink/70">
                {p.delivery}: {money(settings.delivery_da, lang, settings)}
              </p>
              {tiers.length > 0 && (
                <>
                  <p className="mt-6 font-bold text-gold-ink">{p.bulkTitle}</p>
                  <ul className="mx-auto mt-3 grid max-w-md gap-2">
                    {tiers.map((tier) => (
                      <li
                        key={tier.qty}
                        className="flex items-center justify-between rounded-xl border border-line bg-sand2 px-4 py-2.5"
                      >
                        <span className="font-medium">{p.bulkRow(tier.qty)}</span>
                        <span className="font-extrabold text-gold-ink">
                          {money(tier.price, lang, settings)} / {p.perBox}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        <section id="reviews" className="reveal bg-night py-16 text-white md:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-extrabold text-gold-lt md:text-4xl">
              {t.reviews.title}
            </h2>
            <p className="mb-10 mt-2 text-white/70">{t.reviews.sub}</p>
            <Reviews t={t} lang={lang} reviews={reviews} />
          </div>
        </section>

        {/* ORDER */}
        <section id="order" className="reveal mx-auto max-w-3xl px-5 py-16 md:py-20">
          <h2 className="text-center text-3xl font-extrabold text-gold-ink md:text-4xl">
            {t.order.title}
          </h2>
          <p className="mb-8 mt-3 text-center text-lg">{t.order.sub}</p>
          <OrderForm t={t} lang={lang} settings={settings} />
        </section>
      </main>

      <footer className="border-t border-gold/20 bg-night px-5 py-10 text-center text-sm text-white/70">
        <img
          src="/box-front.jpg"
          alt={FACTS.name}
          width={48}
          height={48}
          className="mx-auto h-12 w-12 rounded-full border border-gold/40 object-cover"
        />
        <p className="mt-3 text-xl font-extrabold tracking-[0.25em] text-gold-lt">{FACTS.name}</p>
        <p className="mt-1">{t.footer.tagline}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a
            href={`tel:${settings.phone_display.replace(/\s/g, "")}`}
            dir="ltr"
            className="hover:text-gold-lt"
          >
            {settings.phone_display}
          </a>
          <a href={settings.instagram} target="_blank" rel="noopener" className="hover:text-gold-lt">
            Instagram
          </a>
          <a href={settings.facebook} target="_blank" rel="noopener" className="hover:text-gold-lt">
            Facebook
          </a>
          <a href={settings.website} target="_blank" rel="noopener" className="hover:text-gold-lt">
            {settings.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
        <p className="mt-5">{t.footer.rights}</p>
        <p className="mt-1">{t.footer.made}</p>
      </footer>

      <a
        href={wa()}
        target="_blank"
        rel="noopener"
        aria-label={t.hero.whatsapp}
        className="fixed bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-wa px-5 py-3 font-bold text-white shadow-[0_10px_30px_-8px_rgba(15,123,61,.6)] transition-transform hover:-translate-y-0.5 ltr:right-5 rtl:left-5"
      >
        💬 <span className="hidden sm:inline">{t.waFloat}</span>
      </a>
    </div>
  );
}
