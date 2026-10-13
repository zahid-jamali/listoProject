import { DollarSign, TrendingUp, KeyRound, CalendarDays } from "lucide-react";

const items = [
  {
    title: "Recent Solds",
    icon: DollarSign,
  },
  {
    title: "Price Changes",
    icon: TrendingUp,
  },
  {
    title: "Assignment Sales",
    icon: KeyRound,
  },
  {
    title: "Open Houses",
    icon: CalendarDays,
  },
];

export default function QuickActions({ municipality }) {
  const areaLabel = municipality || "this area";

  return (
    <section className="w-full pb-8 pt-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl bg-[#001538] p-8 text-center text-white shadow-xl hover:-translate-y-2 transition cursor-pointer"
            >
              <Icon size={38} className="mx-auto text-orange-500" />

              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>

              <p className="text-slate-400 mt-2">In {areaLabel}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
