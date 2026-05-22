// src/components/home/FeaturedProjects.jsx

"use client";

import { useEffect, useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    fetchProjects();
  }, [params?.city]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // dynamic city from url
      // example: /dubai

      let url = `/api/get_projects`;

      if (params?.city) {
        url += `?area_slug=${params.city}`;
      }

      const res = await fetch(url);

      const data = await res.json();

      setProjects(data?.rows || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <section className="w-full bg-[#f5f5f5] py-14 lg:py-20">
        <div className="mx-auto max-w-[1450px] px-4 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between gap-4">
            {/* LEFT */}
            <div className="flex flex-wrap items-center gap-3">
              {/* TITLE */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F36B22]/10">
                  <img
                    src="/assets/logo.png"
                    alt="logo"
                    className="h-5 w-5 object-contain"
                  />
                </div>

                <h2 className="text-[28px] font-black tracking-[-0.03em] text-[#0B132B] lg:text-[34px]">
                  Pre-Construction projects
                </h2>
              </div>

              {/* CITY FILTER */}
              {params?.city && (
                <button className="rounded-full border border-[#F36B22]/20 bg-[#F36B22]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#F36B22]">
                  {params.city}
                </button>
              )}
            </div>

            {/* MAP BUTTON */}
            {/* <button className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-sm transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
            Map
          </button> */}
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[360px] animate-pulse rounded-[24px] bg-neutral-200"
                />
              ))}
            </div>
          ) : (
            <>
              {/* PROJECTS GRID */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group overflow-hidden rounded-[22px] border border-neutral-200 bg-[#07152E] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.16)]"
                  >
                    {/* IMAGE */}
                    <div className="relative h-[220px] overflow-hidden">
                      <img
                        src={
                          project?.thumbnail || "https://placehold.co/600x400"
                        }
                        alt={project?.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      {/* BADGE */}
                      {project?.badges1?.[0]?.text && (
                        <div className="absolute left-4 top-4 rounded-full bg-[#F36B22] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg">
                          {project.badges1[0].text}
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* TITLE */}
                      <h3 className="line-clamp-1 text-[24px] font-black tracking-[-0.03em] text-white">
                        {project.title}
                      </h3>

                      {/* LOCATION */}
                      <div className="mt-2 flex items-center gap-2 text-sm text-neutral-300">
                        <MapPin size={15} className="text-[#F36B22]" />

                        <p className="line-clamp-1">{project.addr}</p>
                      </div>

                      {/* PRICE */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                          Starting From
                        </p>

                        <h4 className="mt-1 text-[28px] font-black tracking-[-0.03em] text-white">
                          {project.lp_dol_text}
                        </h4>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                        {/* DETAILS BUTTON */}
                        <Link
                          href={project.access_url}
                          className="rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_rgba(243,107,34,0.35)] transition-all hover:scale-105"
                        >
                          Details
                        </Link>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">
                          <button className="text-neutral-400 transition-all hover:text-[#F36B22]">
                            <Heart size={16} />
                          </button>

                          <button className="text-neutral-400 transition-all hover:text-[#F36B22]">
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="mt-12 flex items-center justify-center gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
                  <ChevronLeft size={18} />
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-[#F36B22] hover:text-[#F36B22]">
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
