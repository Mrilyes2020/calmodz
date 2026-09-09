"use client";

import { useState } from "react";
import { FACTS, type T } from "@/i18n/content";

type TT = (typeof T)["ar"];
type Errors = { name?: string; phone?: string; wilaya?: string };

/**
 * Order form — no backend, no payment (the brand's real channel is WhatsApp,
 * printed on the packaging). The complete order is composed and sent to the
 * official WhatsApp number +213 796 02 85 88.
 */
export function OrderForm({ t }: { t: TT }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [qty, setQty] = useState(1);
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().length < 3) e.name = t.order.errName;
    if (!/^\+?[0-9][0-9\s-]{7,14}$/.test(phone.trim())) e.phone = t.order.errPhone;
    if (wilaya.trim().length < 2) e.wilaya = t.order.errWilaya;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const qtyLabel = `${qty} ${qty === 1 ? t.order.box : t.order.boxes}`;
    const msg = [
      t.waMessage,
      "",
      `— ${t.order.title} —`,
      `${t.order.name}: ${name.trim()}`,
      `${t.order.phone}: ${phone.trim()}`,
      `${t.order.wilaya}: ${wilaya.trim()}`,
      `${t.order.qty}: ${qtyLabel}`,
    ].join("\n");

    window.open(
      `https://wa.me/${FACTS.whatsapp}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener",
    );
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-card px-4 py-3 text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";
  const errCls = "mt-1 text-sm font-bold text-gold-ink";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-line bg-card p-6 shadow-[0_8px_24px_-14px_rgba(20,16,8,.18)] sm:p-8"
    >
      <fieldset className="grid min-w-0 gap-5">
        <div>
          <label htmlFor="ord-name" className="mb-1 block font-bold">
            {t.order.name} *
          </label>
          <input
            id="ord-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.order.namePh}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "ord-err-name" : undefined}
            className={inputCls}
          />
          {errors.name && (
            <p id="ord-err-name" role="alert" className={errCls}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ord-phone" className="mb-1 block font-bold">
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
              aria-describedby={errors.phone ? "ord-err-phone" : undefined}
              className={inputCls}
            />
            {errors.phone && (
              <p id="ord-err-phone" role="alert" className={errCls}>
                {errors.phone}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="ord-wilaya" className="mb-1 block font-bold">
              {t.order.wilaya} *
            </label>
            <input
              id="ord-wilaya"
              type="text"
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              placeholder={t.order.wilayaPh}
              aria-invalid={Boolean(errors.wilaya)}
              aria-describedby={errors.wilaya ? "ord-err-wilaya" : undefined}
              className={inputCls}
            />
            {errors.wilaya && (
              <p id="ord-err-wilaya" role="alert" className={errCls}>
                {errors.wilaya}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="ord-qty" className="mb-1 block font-bold">
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
            <span className="min-w-20 rounded-xl border border-line bg-sand px-3 py-2 text-center font-extrabold text-gold-ink">
              {qty} {qty === 1 ? t.order.box : t.order.boxes}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-wa px-7 py-3.5 font-extrabold text-white transition-transform hover:-translate-y-0.5"
        >
          💬 {t.order.submit}
        </button>
        <p className="text-sm text-ink/70">{t.order.note}</p>
      </fieldset>
    </form>
  );
}
