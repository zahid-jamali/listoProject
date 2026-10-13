"use client";

import { Footprints, Bus, Bike } from "lucide-react";

function scoreTone(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return "border-slate-300 text-slate-600";
  if (n >= 70) return "border-emerald-500 text-emerald-700";
  if (n >= 50) return "border-amber-500 text-amber-700";
  if (n >= 25) return "border-orange-500 text-orange-700";
  return "border-rose-500 text-rose-700";
}

function ScoreCard({ icon: Icon, title, score, category, description, area }) {
  if (score == null || score === "") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 bg-slate-50 ${scoreTone(score)}`}
        >
          <span className="text-lg font-black leading-none">{score}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[#F36B22]">
            <Icon size={14} />
            <p className="text-xs font-bold uppercase tracking-[0.08em]">
              {title}
            </p>
          </div>
          <h3 className="mt-1 text-base font-bold text-[#0B132B]">
            {category || "—"}
          </h3>
          {description && (
            <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
          )}
          {area && <p className="mt-2 text-xs text-slate-400">{area}</p>}
        </div>
      </div>
    </div>
  );
}

export default function NeighborhoodOverview({
  walkscore,
  community,
  municipality,
  vibe = null,
}) {
  const area = [community, municipality].filter(Boolean).join(" · ");
  const cards = [];

  if (walkscore?.score != null) {
    cards.push({
      icon: Footprints,
      title: "Walk Score®",
      score: walkscore.score,
      category: walkscore.category,
      description: walkscore.category_description,
    });
  }
  if (walkscore?.transit?.score != null) {
    cards.push({
      icon: Bus,
      title: "Transit Score™",
      score: walkscore.transit.score,
      category: walkscore.transit.category,
      description: walkscore.transit.description,
    });
  }
  if (walkscore?.bike?.score != null) {
    cards.push({
      icon: Bike,
      title: "Bike Score®",
      score: walkscore.bike.score,
      category: walkscore.bike.category,
      description: walkscore.bike.description,
    });
  }

  if (!cards.length && !vibe) return null;

  return (
    <section className="w-full overflow-x-hidden py-4">
      <h2 className="mb-2 text-xl font-bold text-[#0B132B] sm:text-2xl lg:text-3xl">
        Neighborhood Overview
      </h2>
      <p className="mb-5 text-sm text-slate-500 sm:mb-6">
        How easy is it to get around this neighborhood on foot, by transit, or
        by bike?
      </p>

      {vibe && (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#F36B22]">
            Neighborhood vibe
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{vibe}</p>
        </div>
      )}

      {cards.length > 0 && (
        <div
          className={`grid gap-4 ${
            cards.length === 1
              ? "md:grid-cols-1"
              : cards.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-3"
          }`}
        >
          {cards.map((card) => (
            <ScoreCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              score={card.score}
              category={card.category}
              description={card.description}
              area={area}
            />
          ))}
        </div>
      )}
    </section>
  );
}
