import { useState } from "react";
import type { T } from "@/i18n/content";
import { supabase } from "@/integrations/supabase/client";
import type { PublicReview } from "@/lib/site.functions";
import { Button } from "@/components/ui/button";
import { MessageSquareQuote, Star } from "lucide-react";

type TT = (typeof T)["ar"];

const RATINGS = [5, 4, 3, 2, 1];

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n}/5`} className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < n ? "fill-current" : "text-sand/15"}`} />
      ))}
    </span>
  );
}

const PENDING = {
  ar: "شكرًا لك! سيظهر رأيك بعد مراجعته من طرف الفريق.",
  fr: "Merci ! Votre avis sera publié après validation par l'équipe.",
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
    "w-full rounded-md border border-sand/10 bg-night px-4 py-3 text-sand outline-none transition placeholder:text-sand/30 focus:border-gold focus:ring-2 focus:ring-gold/20";
  const errCls = "mt-1 text-sm font-bold text-gold-lt";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <form
        onSubmit={onSubmit}
        noValidate
        className="h-fit rounded-lg border border-sand/10 bg-night2 p-6 shadow-editorial sm:p-8"
      >
        <h3 className="mb-5 flex items-center gap-3 text-xl font-extrabold text-gold-lt">
          <MessageSquareQuote className="h-5 w-5" aria-hidden /> {t.reviews.formTitle}
        </h3>
        <fieldset className="grid min-w-0 gap-5">
          <div>
            <label htmlFor="rev-name" className="mb-1 block font-bold text-sand">
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
            <label htmlFor="rev-rating" className="mb-1 block font-bold text-sand">
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
            <label htmlFor="rev-text" className="mb-1 block font-bold text-sand">
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

          <Button
            type="submit"
            disabled={sending}
            variant="gold"
            size="xl"
            className="w-full"
          >
            {t.reviews.submit}
          </Button>

          {justPosted && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-gold/40 bg-gold/10 p-4"
            >
              <p className="font-extrabold text-gold-lt">{t.reviews.successTitle}</p>
              <p className="mt-1 text-sm text-sand/75">{PENDING[lang]}</p>
            </div>
          )}
        </fieldset>
      </form>

      <div>
        <p className="mb-4 text-sm font-bold text-sand/60">
          {t.reviews.sampleNote} · {reviews.length}
        </p>
        {reviews.length === 0 ? (
          <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-sand/15 p-10 text-center text-sand/60">
            {t.reviews.empty}
          </div>
        ) : (
          <ul className="grid gap-4">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-sand/10 bg-night2 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-extrabold text-sand">{r.name}</p>
                  <Stars n={r.rating} />
                </div>
                <p className="mt-2 text-sand/85">{r.text}</p>
                <p className="mt-2 text-xs text-sand/45">
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
