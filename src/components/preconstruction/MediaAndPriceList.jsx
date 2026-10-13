"use client";

import { FileText } from "lucide-react";

export default function MediaAndPriceList({ docs = [] }) {
  if (!docs?.length) return null;

  return (
    <section className="w-full py-2">
      <h2 className="mb-4 text-2xl font-bold text-[#0B132B] lg:text-3xl">
        Media / Price List
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <a
            key={doc.href}
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#F36B22]/40 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <FileText size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[#0B132B]">
                {doc.caption || "Document"}
              </span>
              <span className="text-xs text-slate-500">Open PDF</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
