"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-14 flex justify-center items-center gap-3">
      <button
        disabled={currentPage === 1}
        onClick={() => router.push(`/trending?page=${currentPage - 1}`)}
        className="h-10 w-10 rounded-md border bg-white flex items-center justify-center disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2),
          )
          .map((page) => (
            <button
              key={page}
              onClick={() => router.push(`/trending?page=${page}`)}
              className={`h-10 min-w-[40px] rounded-md font-medium ${
                currentPage === page
                  ? "bg-[#F58233] text-white"
                  : "bg-white border"
              }`}
            >
              {page}
            </button>
          ))}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => router.push(`/trending?page=${currentPage + 1}`)}
        className="h-10 w-10 rounded-md border bg-white flex items-center justify-center disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
