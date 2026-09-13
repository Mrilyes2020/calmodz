import { useState } from "react";
import type { T } from "@/i18n/content";
import { supabase } from "@/integrations/supabase/client";
import { money, orderTotals, type SiteSettings } from "@/lib/settings";
import { PRICE_T } from "@/i18n/pricing";
import { Button } from "@/components/ui/button";
import { MessageCircle, PackageCheck, ShieldCheck } from "lucide-react";

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
    "w-full rounded-md border border-sand/10 bg-night px-4 py-3.5 text-sand outline-none transition placeholder:text-sand/30 focus:border-gold focus:ring-2 focus:ring-gold/20";
  const labelCls = "block text-xs font-bold text-gold-lt";
  const errCls = "mt-1 text-sm font-bold text-gold-lt";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative overflow-hidden rounded-lg border border-sand/10 bg-night2 p-5 shadow-editorial sm:p-10"
    >
      <fieldset className="relative z-10 grid min-w-0 gap-7">
        <div className="flex items-center gap-3 border-b border-sand/10 pb-5">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold">
            <PackageCheck className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-extrabold text-sand">{t.order.title}</p>
            <p className="text-xs text-sand/45">{t.order.note}</p>
          </div>
        </div>
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
             <span className="min-w-24 rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-center font-extrabold text-gold">
              {qty} {qty === 1 ? t.order.box : t.order.boxes}
            </span>
          </div>
        </div>

        {settings.show_prices && (
          <div className="grid gap-2 rounded-md border border-sand/10 bg-night p-5 text-sm text-sand/65">
            <div className="flex justify-between">
              <span>
                {p.unit} × {qty}
              </span>
              <span className="font-bold text-sand">{money(totals.goods, lang, settings)}</span>
            </div>
            <div className="flex justify-between">
              <span>{p.delivery}</span>
              <span className="font-bold text-sand">{money(totals.delivery, lang, settings)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-sand/10 pt-3 text-lg">
              <span className="font-black text-gold">{p.total}</span>
              <span className="font-black text-gold">{money(totals.total, lang, settings)}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={sending}
          variant="gold"
          size="xl"
          className="w-full"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          {t.order.submit}
        </Button>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-sand/45">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
          {(lang === "ar" ? settings.order_note_ar : settings.order_note_fr) || t.order.note}
        </p>
      </fieldset>
    </form>
  );
}
