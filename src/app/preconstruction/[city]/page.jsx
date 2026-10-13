// src/components/home/FeaturedProjects.jsx

"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PreconstructionCard from "@/components/PreconstructionCard";

const PAGE_SIZE = 18;

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const fetchProjects = async (currentPage = 1) => {
    try {
      setLoading(true);

      const q = new URLSearchParams({
        sort: "id",
        order: "desc",
        limit: String(PAGE_SIZE),
        offset: String((currentPage - 1) * PAGE_SIZE),
        incl_total: "1",
      });
      if (params?.city) q.set("area_slug", params.city);

      const res = await fetch(`/api/get_projects?${q}`);
      const data = await res.json();

      const rows = data?.rows || [];
      setProjects(rows);
      setTotal(Number(data?.total || data?.count || rows.length));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [params?.city]);

  useEffect(() => {
    fetchProjects(page);
  }, [params?.city, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages || projects.length === PAGE_SIZE;

  return (
    <div className="container mx-auto mt-4">
      <section className="w-full bg-[#f5f5f5] pb-14 pt-24 lg:pb-20 lg:pt-28">
        <div className="mx-auto max-w-[1450px] px-4 lg:px-8">
          {/* HEADER */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-black tracking-[-0.03em] text-[#0B132B] lg:text-[34px]">
                Pre-Construction Projects
              </h1>

              {params?.city && (
                <span className="rounded-full border border-[#F36B22]/20 bg-[#F36B22]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#F36B22]">
                  {String(params.city).replace(/-/g, " ")}
                </span>
              )}
            </div>

            <Link
              href="/pre-construction-projects-by-area"
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-sm transition-all hover:border-[#F36B22] hover:text-[#F36B22]"
            >
              All Areas
            </Link>
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
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-neutral-300 bg-white py-20 text-center">
              <Building2 className="h-12 w-12 text-neutral-300" />
              <p className="mt-4 text-lg font-bold text-neutral-800">
                No pre-construction projects found
              </p>
              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Check back soon or browse all active pre-construction areas across Ontario.
              </p>
              <Link
                href="/pre-construction-projects-by-area"
                className="mt-6 rounded-full bg-[#F36B22] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#d95c1a]"
              >
                Explore All Areas
              </Link>
            </div>
          ) : (
            <>
              {/* PROJECTS GRID */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <PreconstructionCard key={project.id} listing={project} />
                ))}
              </div>

              {/* PAGINATION */}
              {(hasPrev || hasNext) && (
                <div className="mt-12 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={!hasPrev}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-[#F36B22] hover:text-[#F36B22] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-3 text-sm font-bold text-neutral-700">
                    Page {page}
                    {total > PAGE_SIZE ? ` of ${totalPages}` : ""}
                  </span>

                  <button
                    type="button"
                    disabled={!hasNext}
                    onClick={() => {
                      setPage((p) => p + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all hover:border-[#F36B22] hover:text-[#F36B22] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
