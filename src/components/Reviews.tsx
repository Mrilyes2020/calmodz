import { useState } from "react";
import type { T } from "@/i18n/content";
import { supabase } from "@/integrations/supabase/client";
import type { PublicReview } from "@/lib/site.functions";

type TT = (typeof T)["ar"];

const RATINGS = [5, 4, 3, 2, 1];

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n}/5`} className="text-gold tracking-wide">
      {"★".repeat(n)}
      <span className="text-line">{"★".repeat(5 - n)}</span>
    </span>
  );
}

const PENDING = {
  ar: "شكرًا لك! سيظهر رأيك بعد مراجعته من طرف الفريق. 🌿",
  fr: "Merci ! Votre avis sera publié après validation par l'équipe. 🌿",
};

/** Customer reviews — stored in the backend and published after approval. */
export function Reviews({
  t,
  lang,
  reviews,
}: {
  t: TT;
  lang: "ar" | "fr";
  reviews: PublicReview[];
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ name?: string; text?: string }>({});
  const [justPosted, setJustPosted] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: typeof errors = {};
    if (name.trim().length < 2) e.name = t.reviews.errName;
    if (text.trim().length < 10) e.text = t.reviews.errText;
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSending(true);
    const { error } = await supabase.from("reviews").insert({
      name: name.trim(),
      rating,
      text: text.trim(),
      lang,
      approved: false,
    });
    setSending(false);
    if (error) return;

    setName("");
    setText("");
    setRating(5);
    setJustPosted(true);
  };

  const inputCls =
    "w-full rounded-xl border border-white/15 bg-night2 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-gold focus:ring-2 focus:ring-gold/30";
  const errCls = "mt-1 text-sm font-bold text-gold-lt";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={onSubmit}
        noValidate
        className="h-fit rounded-3xl border border-white/10 bg-night2 p-6 sm:p-8"
      >
        <h3 className="mb-5 text-xl font-extrabold text-gold-lt">
          ✍️ {t.reviews.formTitle}
        </h3>
        <fieldset className="grid min-w-0 gap-5">
          <div>
            <label htmlFor="rev-name" className="mb-1 block font-bold text-white">
              {t.reviews.name} *
            </label>
            <input
              id="rev-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.reviews.namePh}
              className={inputCls}
            />
            {errors.name && (
              <p role="alert" className={errCls}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rev-rating" className="mb-1 block font-bold text-white">
              {t.reviews.rating}
            </label>
            <select
              id="rev-rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className={inputCls}
            >
              {RATINGS.map((r) => (
                <option key={r} value={r}>
                  {"★".repeat(r)} ({r}/5)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="rev-text" className="mb-1 block font-bold text-white">
              {t.reviews.text} *
            </label>
            <textarea
              id="rev-text"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.reviews.textPh}
              className={`${inputCls} resize-y`}
            />
            {errors.text && (
              <p role="alert" className={errCls}>
                {errors.text}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-gold px-7 py-3 font-extrabold text-night transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {t.reviews.submit}
          </button>

          {justPosted && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-xl border border-gold/40 bg-gold/10 p-4"
            >
              <p className="font-extrabold text-gold-lt">{t.reviews.successTitle}</p>
              <p className="mt-1 text-sm text-white/75">{PENDING[lang]}</p>
            </div>
          )}
        </fieldset>
      </form>

      <div>
        <p className="mb-4 text-sm font-bold text-white/60">
          {t.reviews.sampleNote} · {reviews.length}
        </p>
        {reviews.length === 0 ? (
          <div className="grid min-h-48 place-items-center rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/60">
            {t.reviews.empty}
          </div>
        ) : (
          <ul className="grid gap-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-white/10 bg-night2 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-extrabold text-white">{r.name}</p>
                  <Stars n={r.rating} />
                </div>
                <p className="mt-2 text-white/85">{r.text}</p>
                <p className="mt-2 text-xs text-white/50">
                  {new Date(r.created_at).toLocaleDateString(
                    lang === "ar" ? "ar-DZ" : "fr-DZ",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
