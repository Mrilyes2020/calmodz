import { useState } from "react";
import type { T } from "@/i18n/content";
import { supabase } from "@/integrations/supabase/client";
import { money, orderTotals, type SiteSettings } from "@/lib/settings";
import { PRICE_T } from "@/i18n/pricing";

type TT = (typeof T)["ar"];
type Errors = { name?: string; phone?: string; wilaya?: string };

/**
 * Order form — saves the order in the dashboard, then hands the customer
 * over to WhatsApp with the full order (price included).
 */
export function OrderForm({
  t,
  lang,
  settings,
}: {
  t: TT;
  lang: "ar" | "fr";
  settings: SiteSettings;
}) {
  const p = PRICE_T[lang];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  const totals = orderTotals(settings, qty);

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 3) e.name = t.order.errName;
    if (!/^\+?[0-9][0-9\s-]{7,14}$/.test(phone.trim())) e.phone = t.order.errPhone;
    if (wilaya.trim().length < 2) e.wilaya = t.order.errWilaya;
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSending(true);
    try {
      await supabase.from("orders").insert({
        name: name.trim(),
        phone: phone.trim(),
        wilaya: wilaya.trim(),
        qty,
        total_da: settings.show_prices ? totals.total : 0,
      });
    } catch {
      /* the WhatsApp handover is the source of truth — never block it */
    }
    setSending(false);

    const qtyLabel = `${qty} ${qty === 1 ? t.order.box : t.order.boxes}`;
    const lines = [
      t.waMessage,
      "",
      `— ${t.order.title} —`,
      `${t.order.name}: ${name.trim()}`,
      `${t.order.phone}: ${phone.trim()}`,
      `${t.order.wilaya}: ${wilaya.trim()}`,
      `${t.order.qty}: ${qtyLabel}`,
    ];
    if (settings.show_prices) {
      lines.push(`${p.subtotal}: ${money(totals.goods, lang, settings)}`);
      lines.push(`${p.delivery}: ${money(totals.delivery, lang, settings)}`);
      lines.push(`${p.total}: ${money(totals.total, lang, settings)}`);
    }

    window.open(
      `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener",
    );
  };

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none transition placeholder:text-white/25 focus:border-gold";
  const labelCls = "block text-[11px] font-black uppercase tracking-widest text-gold";
  const errCls = "mt-1 text-sm font-bold text-gold-lt";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative overflow-hidden rounded-[48px] border border-white/10 bg-white/5 p-8 sm:p-12"
    >
      <div
        className="absolute -mr-32 -mt-32 right-0 top-0 h-64 w-64 rounded-full bg-gold/5 blur-[100px]"
        aria-hidden
      />
      <fieldset className="relative z-10 grid min-w-0 gap-7">
        <div className="grid gap-7 md:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <label htmlFor="ord-name" className={labelCls}>
              {t.order.name} *
            </label>
            <input
              id="ord-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.order.namePh}
              aria-invalid={Boolean(errors.name)}
              className={inputCls}
            />
            {errors.name && (
              <p role="alert" className={errCls}>
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="ord-phone" className={labelCls}>
              {t.order.phone} *
            </label>
            <input
              id="ord-phone"
              type="tel"
              inputMode="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.order.phonePh}
              aria-invalid={Boolean(errors.phone)}
              className={inputCls}
            />
            {errors.phone && (
              <p role="alert" className={errCls}>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="ord-wilaya" className={labelCls}>
            {t.order.wilaya} *
          </label>
          <input
            id="ord-wilaya"
            type="text"
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            placeholder={t.order.wilayaPh}
            aria-invalid={Boolean(errors.wilaya)}
            className={inputCls}
          />
          {errors.wilaya && (
            <p role="alert" className={errCls}>
              {errors.wilaya}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <label htmlFor="ord-qty" className={labelCls}>
            {t.order.qty}
          </label>
          <div className="flex items-center gap-4">
            <input
              id="ord-qty"
              type="range"
              min={1}
              max={10}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="accent-gold flex-1"
            />
            <span className="min-w-24 rounded-2xl border border-gold/30 bg-gold/10 px-3 py-2 text-center font-extrabold text-gold">
              {qty} {qty === 1 ? t.order.box : t.order.boxes}
            </span>
          </div>
        </div>

        {settings.show_prices && (
          <div className="grid gap-2 rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
            <div className="flex justify-between">
              <span>
                {p.unit} × {qty}
              </span>
              <span className="font-bold text-white">{money(totals.goods, lang, settings)}</span>
            </div>
            <div className="flex justify-between">
              <span>{p.delivery}</span>
              <span className="font-bold text-white">{money(totals.delivery, lang, settings)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-white/10 pt-3 text-lg">
              <span className="font-black text-gold">{p.total}</span>
              <span className="font-black text-gold">{money(totals.total, lang, settings)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="rounded-2xl bg-gold py-5 text-lg font-black text-night transition-all hover:shadow-[0_20px_50px_rgba(197,160,89,0.2)] disabled:opacity-60"
        >
          {t.order.submit}
        </button>
        <p className="text-sm text-white/40">
          {(lang === "ar" ? settings.order_note_ar : settings.order_note_fr) || t.order.note}
        </p>
      </fieldset>
    </form>
  );
}
