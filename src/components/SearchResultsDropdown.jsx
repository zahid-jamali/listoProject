"use client";

import Link from "next/link";
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

export default function SearchResultsDropdown({
  results = [],
  loading = false,
  query = "",
  onClose,
}) {
  if (!query) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-[9999] mt-3 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.15)]">
      {loading ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#F36B22] border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="p-8 text-center">
          <Search className="mx-auto mb-3 text-slate-300" size={32} />
          <p className="font-medium text-slate-900">No results found</p>
          <p className="mt-1 text-sm text-slate-500">Try another search term</p>
        </div>
      ) : (
        <div className="max-h-[650px] overflow-y-auto z-[9999]">
          {Object.keys(CATEGORY_TITLES).map((category) => {
            const items = results.filter((r) => r.category === category);

            if (!items.length) return null;

            const Icon = CATEGORY_ICONS[category] || Search;

            return (
              <div
                key={category}
                className="border-b border-slate-100 last:border-b-0"
              >
                <div className="sticky top-0 flex items-center gap-2 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Icon size={14} />
                  {CATEGORY_TITLES[category]}
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px]">
                    {items.length}
                  </span>
                </div>

                <div className="p-2">
                  {items.slice(0, 6).map((item, index) => (
                    <Link
                      key={`${item.access_url}-${index}`}
                      href={item.access_url}
                      onClick={onClose}
                      className="group flex gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-orange-50"
                    >
                      {/* Image/Icon */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {item.icon?.includes("<img") ? (
                          <div
                            className="h-full w-full"
                            dangerouslySetInnerHTML={{
                              __html: item.icon,
                            }}
                          />
                        ) : (
                          <Icon size={20} className="text-[#F36B22]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-1 font-semibold text-slate-900">
                          {item.name}
                        </div>

                        {item.lp_dol && (
                          <div
                            className="mt-1 text-sm font-bold text-[#F36B22]"
                            dangerouslySetInnerHTML={{
                              __html: item.lp_dol,
                            }}
                          />
                        )}

                        {item.sub_heading && (
                          <div
                            className="mt-1 line-clamp-1 text-xs text-slate-500"
                            dangerouslySetInnerHTML={{
                              __html: item.sub_heading,
                            }}
                          />
                        )}

                        {item.sub_promo && (
                          <div className="mt-1 text-xs text-green-600">
                            {item.sub_promo}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
