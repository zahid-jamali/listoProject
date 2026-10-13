"use client";

import { useRouter } from "next/navigation";
import {
  getListingUrl,
  getProjectUrl,
  stashListing,
  stashProject,
} from "@/lib/listing-url";
import {
  MapPin,
  Home,
  Building2,
  FileText,
  Clock3,
  Search,
} from "lucide-react";

const CATEGORY_ICONS = {
  LOCATION: MapPin,
  ADDRESS: MapPin,
  HOMES: Home,
  CONDOS: Building2,
  ASSIGNMENT: FileText,
  SOLDS: Clock3,
  TERMINATED: Clock3,
};

const CATEGORY_TITLES = {
  LOCATION: "Locations",
  ADDRESS: "Addresses",
  HOMES: "Homes",
  CONDOS: "Condos",
  ASSIGNMENT: "Assignments",
  SOLDS: "Recently Sold",
  TERMINATED: "Terminated Listings",
};

/**
 * Resolve internal Next.js href for a search result item.
 * For listing types (HOMES, CONDOS, ASSIGNMENT, SOLDS, TERMINATED) we navigate
 * to our own pages. For LOCATION / ADDRESS we fall back to the upstream access_url.
 */
function resolveHref(item) {
  const category = item.category || "";

  // Pre-construction items
  if (item.type === "PC" || category === "PC") {
    return getProjectUrl(item);
  }

  if (
    ["HOMES", "CONDOS", "ASSIGNMENT", "SOLDS", "TERMINATED"].includes(category)
  ) {
    return getListingUrl(item);
  }

  // For LOCATION / ADDRESS / CITY / COMMUNITY: use the upstream search url
  // (legacy access_url). Strip the trailing "?" that main_search appends.
  return (item.access_url || "/").replace(/\?+$/, "");
}

export default function SearchResultsDropdown({
  results = [],
  loading = false,
  query = "",
  onClose,
}) {
  const router = useRouter();

  if (!query) return null;

  const handlePCClick = (item) => {
    stashProject(item);
    onClose?.();
    router.push(getProjectUrl(item));
  };

  const handleListingClick = (item) => {
    stashListing(item);
    onClose?.();
    router.push(getListingUrl(item));
  };

  return (
    <div className="absolute left-0 top-full z-[100] mt-2 w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      {loading ? (
        <div className="p-10 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">Searching for properties...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <Search className="text-slate-300" size={32} />
          </div>
          <p className="text-lg font-bold text-slate-900">No results found</p>
          <p className="mt-1 text-sm text-slate-500">Try searching for a city, neighborhood, or building name</p>
        </div>
      ) : (
        <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
          {Object.keys(CATEGORY_TITLES).map((category) => {
            const items = results.filter((r) => r.category === category);

            if (!items.length) return null;

            const Icon = CATEGORY_ICONS[category] || Search;

            return (
              <div
                key={category}
                className="border-b border-slate-100 last:border-b-0"
              >
                <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-50/95 backdrop-blur-sm px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-orange-500" />
                    {CATEGORY_TITLES[category]}
                  </div>
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px]">
                    {items.length}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  {items.slice(0, 6).map((item, index) => {
                    const isPC = item.type === "PC" || item.category === "PC";
                    const href = resolveHref(item);
                    const isListing = [
                      "HOMES",
                      "CONDOS",
                      "ASSIGNMENT",
                      "SOLDS",
                      "TERMINATED",
                    ].includes(category);

                    const content = (
                      <>
                        {/* Image/Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 group-hover:bg-orange-100 transition-colors">
                          {item.icon?.includes("<img") ? (
                            <div
                              className="h-full w-full"
                              dangerouslySetInnerHTML={{
                                __html: item.icon,
                              }}
                            />
                          ) : item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Icon size={20} className="text-orange-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-1 font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {item.name}
                          </div>

                          {item.lp_dol && (
                            <div
                              className="mt-0.5 text-sm font-black text-orange-500"
                              dangerouslySetInnerHTML={{
                                __html: item.lp_dol,
                              }}
                            />
                          )}

                          {item.sub_heading && (
                            <div
                              className="mt-0.5 line-clamp-1 text-xs text-slate-500"
                              dangerouslySetInnerHTML={{
                                __html: item.sub_heading,
                              }}
                            />
                          )}

                          {item.sub_promo && (
                            <div className="mt-1 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                              {item.sub_promo}
                            </div>
                          )}
                        </div>
                      </>
                    );

                    const rowClass =
                      "group flex items-center gap-4 rounded-xl p-3 transition-all duration-200 hover:bg-orange-50/50 cursor-pointer";

                    if (isPC) {
                      return (
                        <div
                          key={`${item.id || item.access_url}-${index}`}
                          className={rowClass}
                          onClick={() => handlePCClick(item)}
                        >
                          {content}
                        </div>
                      );
                    }

                    if (isListing) {
                      return (
                        <div
                          key={`${item.id || item.access_url}-${index}`}
                          className={rowClass}
                          onClick={() => handleListingClick(item)}
                        >
                          {content}
                        </div>
                      );
                    }

                    // Location / Address: plain link (navigates to search page)
                    return (
                      <a
                        key={`${item.access_url}-${index}`}
                        href={href}
                        onClick={onClose}
                        className={rowClass}
                      >
                        {content}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
