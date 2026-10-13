"use client";

import { Suspense } from "react";
import ListingDetailView from "@/components/listing/ListingDetailView";

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">
          Loading property details…
        </p>
      </div>
    </div>
  );
}

/** Shared wrapper used by /listings/ind and every legacy SEO listing route. */
export default function ListingDetailPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ListingDetailView />
    </Suspense>
  );
}
