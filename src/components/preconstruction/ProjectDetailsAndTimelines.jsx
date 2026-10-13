"use client";

import { ImageIcon } from "lucide-react";

function formatTimelineDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProjectDetailsAndTimelines({
  project = {},
  statusBadge = null,
  photos = [],
  openGallery,
}) {
  const timeline = [
    { label: "Sales start", date: formatTimelineDate(project?.sale_start_date) },
    { label: "Occupancy", date: formatTimelineDate(project?.occ_date) || project?.occupancy },
    { label: "Sold out", date: formatTimelineDate(project?.sold_out_date) },
  ].filter((item) => item.date);

  const descriptionHtml = project?.ad_text || project?.description || "";
  const extrasHtml = project?.extras || "";

  return (
    <section className="w-full py-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0B132B] lg:text-3xl">
            Project Details and Timelines
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Developed by{" "}
            <span className="font-semibold text-[#F36B22]">
              {project?.developer_name || "—"}
            </span>
            {statusBadge?.text ? ` · ${statusBadge.text}` : ""}
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_1fr] lg:p-8">
          <div className="min-w-0 space-y-5">
            {(descriptionHtml || extrasHtml) && (
              <div className="prose prose-sm max-w-none text-slate-700 prose-p:leading-6 prose-strong:text-[#0B132B]">
                {descriptionHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                ) : null}
                {extrasHtml ? (
                  <div
                    className="mt-3"
                    dangerouslySetInnerHTML={{ __html: extrasHtml }}
                  />
                ) : null}
              </div>
            )}

            {timeline.length > 0 && (
              <ul className="relative ml-1.5 space-y-0 border-l-2 border-orange-100">
                {timeline.map((item) => (
                  <li
                    key={item.label}
                    className="relative border-b border-slate-100 py-3 pl-4 last:border-b-0"
                  >
                    <span className="absolute left-0 top-5 h-2 w-2 -translate-x-[5px] rounded-full bg-[#F36B22] ring-4 ring-orange-50" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#0B132B]">
                      {item.date}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {project?.status !== "S" && (
              <a
                href="#project-register"
                className="inline-flex items-center rounded-lg bg-[#0B132B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#151f3a]"
              >
                Register
              </a>
            )}
          </div>

          <div>
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {photos.slice(0, 6).map((photo, i) => (
                  <button
                    key={`${photo.src}-${i}`}
                    type="button"
                    onClick={() => openGallery?.(i)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 focus:outline-none"
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption || `${project?.title} photo ${i + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                <ImageIcon size={32} className="text-slate-300" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
