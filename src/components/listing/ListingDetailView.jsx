"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import ListingHero from "@/components/listing/ListingHero";
import PropertyDetails from "@/components/listing/PropertyDetails";
import SaleLeaseHistory from "@/components/listing/SaleLeaseHistory";
import NeighborhoodOverview from "@/components/listing/NeighborhoodOverview";
import LocationMap from "@/components/listing/LocationMap";
import ComparisonCard from "@/components/listing/ComparasionCard";
import PriceHistoryChart from "@/components/listing/PriceHistoryChart";
import AreaInsights from "@/components/listing/AreaInsights";
import MortgageCalculator from "@/components/listing/MortgageCalculator";
import AgentCard from "@/components/listing/AgentCard";
import QuickActions from "@/components/listing/QuickActions";
import { decodeListingData } from "@/lib/url-helper";
import {
  getListingUrl,
  readStashedListing,
  parseListingPath,
} from "@/lib/listing-url";

function PageSkeleton() {
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

/**
 * Shared single-listing detail view.
 *
 * Hydration order:
 *  1. sessionStorage scoped to this exact SEO path (instant on in-app clicks)
 *  2. `?p=` base64 blob (legacy share links / backwards compatibility)
 *  3. generic sessionStorage listing
 *  4. identifiers parsed from the legacy SEO path (direct visit / crawler)
 *
 * When the SEO path implies a specific MLS id that does not match the cached
 * object, we discard the cache and seed from the path so we never render the
 * wrong property. `/api/singleListing` then fetches the full record by id.
 */
export default function ListingDetailView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favoriteListings") || "[]");
    setFavorites(stored);
  }, []);

  const toggleFavorite = (listing) => {
    const stored = JSON.parse(localStorage.getItem("favoriteListings") || "[]");
    const exists = stored.find((item) => item.id === listing.id);
    let updated;
    if (exists) {
      updated = stored.filter((item) => item.id !== listing.id);
      toast.success("Removed from favorites");
    } else {
      updated = [...stored, listing];
      toast.success("Added to favorites");
    }
    localStorage.setItem("favoriteListings", JSON.stringify(updated));
    setFavorites(updated);
  };

  const handleShare = async (listing) => {
    const shareUrl = `${window.location.origin}${getListingUrl(listing)}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.addr,
          url: shareUrl,
        });
        toast.success("Listing shared");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadListing = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const seo = parseListingPath(pathname);
      let listing = null;

      const p = searchParams.get("p");
      if (p) {
        listing = decodeListingData(p);
      } else {
        listing = readStashedListing(pathname);
      }

      // Guard: never show a cached listing that doesn't match this SEO path.
      if (seo?.id) {
        const cachedId = listing?.id ? String(listing.id) : null;
        if (!listing || cachedId !== String(seo.id)) {
          listing = { ...seo };
        }
      }

      if (!listing || !listing.id) {
        setError("No listing selected. Browse listings and choose a property.");
        return;
      }

      const brd = searchParams.get("brd") || listing.brd;
      const payload = brd ? { ...listing, brd } : listing;

      const res = await fetch("/api/singleListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const pageData = await res.json();

      if (!pageData.success) {
        setError(pageData.message || "Unable to load listing details.");
        return;
      }

      setData(pageData);
      setCalculatorInputs(pageData.calculator?.inputs || null);
      try {
        sessionStorage.setItem("listing", JSON.stringify(pageData.property));
      } catch {
        /* ignore */
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading this property.");
    } finally {
      setLoading(false);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const photos = data?.hero?.photos || [];
  const hero = data?.hero;
  const details = data?.details;
  const neighborhood = data?.neighborhood;
  const activeComps = data?.comparisons?.active || [];
  const soldComps = data?.comparisons?.sold || [];
  const insights = data?.insights || [];

  const chartData = useMemo(() => {
    return (data?.marketTrends || [])
      .slice(0, 6)
      .reverse()
      .map((item) => ({
        month: new Date(item.date).toLocaleDateString("en-CA", {
          month: "short",
        }),
        detached: Number(item.detached_avg_sold_price) / 1000 || 0,
        semi: Number(item.semi_detached_avg_sold_price) / 1000 || 0,
        townhouse: Number(item.twnhouse_avg_sold_price) / 1000 || 0,
        condo: Number(item.condo_apt_avg_sold_price) / 1000 || 0,
      }));
  }, [data?.marketTrends]);

  const calculatorResults = useMemo(() => {
    if (!calculatorInputs) return data?.calculator?.results;

    const homePrice = Number(calculatorInputs.homePrice) || 0;
    const downPaymentPercent =
      Number(calculatorInputs.downPaymentPercent) || 20;
    const interestRate = Number(calculatorInputs.interestRate) || 5.4;
    const termYears = Number(calculatorInputs.termYears) || 25;

    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const months = termYears * 12;
    const mortgageMonthly =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
    const propertyTaxMonthly = (homePrice * 0.004) / 12;
    const estimatedMonthly = mortgageMonthly + propertyTaxMonthly;

    return {
      downPayment,
      loanAmount,
      mortgageMonthly,
      propertyTaxMonthly,
      closingCostsEstimate: homePrice * 0.0175,
      estimatedMonthly,
      affordabilityScore: data?.calculator?.results?.affordabilityScore,
    };
  }, [calculatorInputs, data?.calculator?.results]);

  const mapUrl =
    neighborhood?.lat && neighborhood?.lng
      ? `https://maps.google.com/maps?q=${neighborhood.lat},${neighborhood.lng}&z=15&output=embed`
      : null;

  const openGallery = (index = 0) => {
    setPhotoIndex(index);
    setGalleryOpen(true);
  };

  useEffect(() => {
    if (!galleryOpen) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setGalleryOpen(false);
      if (e.key === "ArrowLeft") {
        setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
      if (e.key === "ArrowRight") {
        setPhotoIndex((prev) => (prev + 1) % photos.length);
      }
    };

    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [galleryOpen, photos.length]);

  if (loading) return <PageSkeleton />;

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#F58232]">
            <MapPin size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Listing unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <Link
            href="/real-estate-listings"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102752]"
          >
            <ArrowLeft size={16} />
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {galleryOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-sm font-medium text-white/80">
              {photoIndex + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
            <button
              type="button"
              onClick={() =>
                setPhotoIndex(
                  (prev) => (prev - 1 + photos.length) % photos.length,
                )
              }
              className="absolute left-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-5"
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
            <img
              src={photos[photoIndex]?.src}
              alt={`${hero?.title} photo ${photoIndex + 1}`}
              className="max-h-[min(72vh,820px)] max-w-full object-contain"
            />
            <button
              type="button"
              onClick={() =>
                setPhotoIndex((prev) => (prev + 1) % photos.length)
              }
              className="absolute right-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-5"
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="overflow-x-auto px-4 pb-4 pt-2 sm:px-6">
            <div className="mx-auto flex w-max gap-2">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-24 ${
                    i === photoIndex
                      ? "border-white"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={photo.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="overflow-x-hidden bg-[#f7f7f7] pb-28 lg:pb-16">
        <ListingHero
          heroImage={hero?.heroImage}
          title={hero?.title}
          subtitle={hero?.subtitle}
          price={hero?.price}
          priceText={hero?.priceText}
          priceKind={hero?.priceKind}
          priceLabel={hero?.priceLabel}
          leasePriceText={hero?.leasePriceText}
          beds={hero?.beds}
          baths={hero?.baths}
          sqft={hero?.sqft}
          photos={photos}
          listing={data.property}
          onBack={() => router.back()}
          onShare={() => handleShare(data.property)}
          onOpenGallery={openGallery}
        />

        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
          <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
            {/* LEFT: listing content */}
            <div className="min-w-0 space-y-2 overflow-x-hidden">
              <PropertyDetails
                details={details || {}}
                beds={hero?.beds}
                baths={hero?.baths}
              />

              <SaleLeaseHistory
                property={data.property}
                address={hero?.title}
              />

              <NeighborhoodOverview
                walkscore={neighborhood?.walkscore}
                community={neighborhood?.community}
                municipality={neighborhood?.municipality}
                vibe={neighborhood?.vibe}
              />

              <LocationMap mapUrl={mapUrl} />

              {activeComps.length > 0 && (
                <section className="w-full overflow-x-hidden py-4 sm:py-6">
                  <h2 className="mb-4 text-xl font-bold text-[#0B132B] sm:mb-6 sm:text-2xl lg:text-3xl">
                    Active Comparisons
                  </h2>
                  <ComparisonCard
                    comps={activeComps}
                    tone="active"
                    currentHero={{
                      ...hero,
                      price: hero?.nativePrice ?? hero?.price,
                      priceText: hero?.nativePriceText ?? hero?.priceText,
                    }}
                  />
                </section>
              )}

              {soldComps.length > 0 && (
                <section className="w-full overflow-x-hidden py-4 sm:py-6">
                  <h2 className="mb-4 text-xl font-bold text-[#0B132B] sm:mb-6 sm:text-2xl lg:text-3xl">
                    Sold Comparisons
                  </h2>
                  <ComparisonCard
                    comps={soldComps}
                    tone="sold"
                    currentHero={{
                      ...hero,
                      price: hero?.nativePrice ?? hero?.price,
                      priceText: hero?.nativePriceText ?? hero?.priceText,
                    }}
                  />
                </section>
              )}

              <PriceHistoryChart
                chartData={chartData}
                municipality={neighborhood?.municipality}
              />

              <AreaInsights insights={insights} heroTitle={hero?.title} />

              <MortgageCalculator
                calculatorInputs={calculatorInputs}
                calculatorResults={calculatorResults}
                onInputChange={(key, value) =>
                  setCalculatorInputs((prev) => ({ ...prev, [key]: value }))
                }
              />

              <QuickActions municipality={neighborhood?.municipality} />
            </div>

            {/* RIGHT: sticky inquiry — after content on mobile */}
            <aside className="min-w-0 lg:sticky lg:top-24 lg:z-20">
              <AgentCard
                defaultMessage={data.contact?.defaultMessage}
                listing={data.property}
              />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
