"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Share2,
  Heart,
  ArrowLeft,
  ImageIcon,
  Building2,
  Calendar,
  Layers,
  Maximize2,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Home,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const TREND_LINES = [
  { key: "detached", color: "#FF5C5C", label: "Detached" },
  { key: "semi", color: "#20C997", label: "Semi-Detached" },
  { key: "townhouse", color: "#3B82F6", label: "Townhouse" },
  { key: "condo", color: "#8B5CF6", label: "Condo" },
];

const PC_TABS = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Project Details" },
  { id: "floorplans", label: "Floor Plans" },
];

function formatCurrency(value) {
  const num = Number(String(value || "").replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num) || num === 0) return value || "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(num);
}

function mortgagePayment(principal, annualRate, years) {
  if (!principal || !annualRate || !years) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) return principal / months;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

function PreConstructionDetailContent() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [models, setModels] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    homePrice: 799000,
    downPaymentPercent: 20,
    interestRate: 5.4,
    termYears: 25,
  });
  const [inquiryMsg, setInquiryMsg] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const stored =
        typeof window !== "undefined" ? sessionStorage.getItem("PG") : null;

      if (!stored) {
        setError(
          "No project selected. Browse pre-construction listings and choose a project.",
        );
        return;
      }

      const raw = JSON.parse(stored);
      setProject(raw);

      // Prefill calculator with project starting price
      const startPrice = Number(
        String(raw?.lp_dol || raw?.lp_dol_from || "").replace(/[^\d.-]/g, ""),
      );
      if (startPrice > 0) {
        setCalculatorInputs((prev) => ({ ...prev, homePrice: startPrice }));
      }

      // Prefill inquiry message
      setInquiryMsg(
        `I'm interested in ${raw?.title || "this pre-construction project"}. Please send me the latest pricing and floor plans.`,
      );

      // Fetch full detail data via project-details API
      const res = await fetch("/api/project-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const data = await res.json();

      if (data?.success) {
        setPageData(data);
      }

      // Fetch floor plan models if we have dv_id
      const dvId = raw?.dv_id || raw?.development_id;
      if (dvId) {
        const modelsRes = await fetch(`/api/models?dv_id=${dvId}`);
        const modelsData = await modelsRes.json();
        setModels(modelsData?.rows || []);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading this project.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const photos = useMemo(
    () => pageData?.hero?.photos || [],
    [pageData?.hero?.photos],
  );

  const heroImage = useMemo(
    () => photos[0]?.src || project?.thumbnail || null,
    [photos, project?.thumbnail],
  );

  const chartData = useMemo(() => {
    return (pageData?.marketTrends || [])
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
  }, [pageData?.marketTrends]);

  const calcResults = useMemo(() => {
    const { homePrice, downPaymentPercent, interestRate, termYears } =
      calculatorInputs;
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const mortgageMonthly = mortgagePayment(
      loanAmount,
      interestRate,
      termYears,
    );
    const propertyTaxMonthly = (homePrice * 0.004) / 12;
    const estimatedMonthly = mortgageMonthly + propertyTaxMonthly;
    const closingCosts = homePrice * 0.0175;

    let score = "A";
    const dti = (estimatedMonthly / (180000 / 12)) * 100;
    if (dti > 28) score = "B+";
    if (dti > 34) score = "C";
    if (dti > 40) score = "D";

    return {
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      mortgageMonthly: Math.round(mortgageMonthly),
      propertyTaxMonthly: Math.round(propertyTaxMonthly),
      estimatedMonthly: Math.round(estimatedMonthly),
      closingCosts: Math.round(closingCosts),
      score,
    };
  }, [calculatorInputs]);

  const mapUrl = useMemo(() => {
    const lat = project?.lat || pageData?.neighborhood?.lat;
    const lng = project?.lng || pageData?.neighborhood?.lng;
    if (lat && lng) {
      return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }
    return null;
  }, [project, pageData?.neighborhood]);

  const openGallery = (index = 0) => {
    setPhotoIndex(index);
    setGalleryOpen(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Loading project details…
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#F58232]">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Project unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <Link
            href="/preconstruction"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A3A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102752]"
          >
            <ArrowLeft size={16} />
            Browse projects
          </Link>
        </div>
      </div>
    );
  }

  const badges = project?.badges1 || [];
  const statusBadge = badges.find((b) => b.display === "PC") || badges[0];
  const municipality =
    project?.municipality ||
    project?.community ||
    pageData?.neighborhood?.municipality;

  return (
    <>
      {/* Full-screen Gallery Modal */}
      {galleryOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <button
            type="button"
            onClick={() => setGalleryOpen(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            onClick={() =>
              setPhotoIndex((p) => (p - 1 + photos.length) % photos.length)
            }
            className="absolute left-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={photos[photoIndex]?.src}
            alt={`${project?.title} photo ${photoIndex + 1}`}
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
          <button
            type="button"
            onClick={() => setPhotoIndex((p) => (p + 1) % photos.length)}
            className="absolute right-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-6 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {photoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#f5f5f5] pb-20">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#F58232]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="relative overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div className="relative h-[420px] md:h-[520px]">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={project?.title || "Project"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200">
                  <ImageIcon size={48} className="text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

              {/* Badges */}
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                {badges.slice(0, 3).map((badge, i) => (
                  <span
                    key={i}
                    className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                      badge.display === "PC"
                        ? "bg-[#F58232] text-white"
                        : "bg-white/90 text-slate-800"
                    }`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="absolute right-5 top-5 flex gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md transition hover:bg-white"
                >
                  <Share2 size={16} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md transition hover:bg-white"
                >
                  <Heart size={16} />
                </button>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-300">
                    Pre-Construction ·{" "}
                    {project?.developer_name || "New Development"}
                  </p>
                  <h1 className="mt-2 text-3xl font-black text-white md:text-5xl">
                    {project?.title}
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/80 md:text-base">
                    <MapPin size={16} />
                    {[project?.addr, project?.community, project?.municipality]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                {photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => openGallery(0)}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-orange-50"
                  >
                    View {photos.length} photos
                  </button>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-1 bg-black p-1 md:grid-cols-6">
                {photos.slice(0, 6).map((photo, index) => (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => openGallery(index)}
                    className="relative aspect-[4/3] overflow-hidden"
                  >
                    <img
                      src={photo.src}
                      alt=""
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price / stats bar */}
          <div className="relative z-10 -mt-8 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 rounded-[24px] bg-white px-6 py-7 shadow-[0_16px_40px_rgba(0,0,0,0.12)] md:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                Starting From
              </p>
              <p className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
                {project?.lp_dol_text ||
                  formatCurrency(project?.lp_dol) ||
                  "Pricing TBD"}
              </p>
            </div>

            <div className="flex flex-wrap gap-8 md:gap-12">
              {project?.product_types && (
                <PCStatChip
                  icon={Home}
                  value={project.product_types}
                  label="Unit Types"
                />
              )}
              {(project?.sqft || project?.sqft_max) && (
                <PCStatChip
                  icon={Maximize2}
                  value={`${project.sqft || ""}${project.sqft_max ? `–${project.sqft_max}` : ""} sqft`}
                  label="Size Range"
                />
              )}
              {project?.units && (
                <PCStatChip
                  icon={Layers}
                  value={project.units}
                  label="Total Units"
                />
              )}
              {project?.storeys && (
                <PCStatChip
                  icon={Building2}
                  value={`${project.storeys} floors`}
                  label="Storeys"
                />
              )}
            </div>

            {statusBadge && (
              <span className="rounded-full bg-[#F58232] px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
                {statusBadge.text}
              </span>
            )}
          </div>
        </section>

        {/* ── Main Grid ── */}
        <section className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.6fr_1fr] lg:px-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Tab panel */}
            <div className="overflow-hidden rounded-[24px] bg-[#06132e] shadow-xl">
              <div className="flex gap-6 border-b border-white/10 px-8 pt-6">
                {PC_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-semibold transition ${
                      activeTab === tab.id
                        ? "border-b-2 border-[#F58232] text-[#F58232]"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-8 text-white">
                {activeTab === "overview" && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <PCDetailItem
                      label="Developer"
                      value={project?.developer_name}
                    />
                    <PCDetailItem
                      label="Project Status"
                      value={statusBadge?.text || project?.status_listo}
                    />
                    <PCDetailItem
                      label="Occupancy"
                      value={project?.occupancy || project?.occupancy_date}
                    />
                    <PCDetailItem
                      label="Municipality"
                      value={project?.municipality}
                    />
                    <PCDetailItem
                      label="Community"
                      value={project?.community}
                    />
                    <PCDetailItem label="Area" value={project?.area} />
                    <PCDetailItem
                      label="Type"
                      value={project?.sub_type2 || project?.product_types}
                    />
                    <PCDetailItem label="Storeys" value={project?.storeys} />
                    <PCDetailItem label="Total Units" value={project?.units} />
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="grid gap-6 md:grid-cols-3">
                    <PCDetailItem label="Address" value={project?.addr} />
                    <PCDetailItem label="City" value={project?.municipality} />
                    <PCDetailItem label="Postal Code" value={project?.zip} />
                    <PCDetailItem
                      label="Min Sqft"
                      value={project?.sqft ? `${project.sqft} sqft` : null}
                    />
                    <PCDetailItem
                      label="Max Sqft"
                      value={
                        project?.sqft_max ? `${project.sqft_max} sqft` : null
                      }
                    />
                    <PCDetailItem label="Maintenance" value={project?.maint} />
                    <PCDetailItem
                      label="Parking"
                      value={project?.parking || project?.gar_spaces}
                    />
                    <PCDetailItem
                      label="Assignment"
                      value={project?.assignment}
                    />
                    <PCDetailItem label="Listed" value={project?.ld} />
                  </div>
                )}

                {activeTab === "floorplans" && (
                  <div>
                    {models.length === 0 ? (
                      <div className="py-12 text-center text-slate-400">
                        <Layers size={40} className="mx-auto mb-4 opacity-40" />
                        <p className="font-medium">
                          Floor plans not yet available
                        </p>
                        <p className="mt-1 text-sm">
                          Register below to receive floor plans when released.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {models.map((model) => (
                          <FloorPlanCard key={model.id} model={model} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Project description */}
            {project?.description && (
              <div className="rounded-[24px] bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  About This Project
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {project.description}
                </p>
              </div>
            )}

            {/* Features / amenities */}
            {(project?.features?.length > 0 ||
              project?.amenities?.length > 0) && (
              <div className="rounded-[24px] bg-white p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Features & Amenities
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(project.features || project.amenities || []).map(
                    (feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      >
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-[#F58232]"
                        />
                        {feat}
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Market trend chart */}
            {chartData.length > 0 && (
              <div className="rounded-[24px] bg-[#00132D] p-6 shadow-xl">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {municipality || "Area"} market trends
                    </h2>
                    <p className="mt-1 text-xs text-[#F58232]">
                      6-month average sold prices across home types
                    </p>
                  </div>
                </div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid stroke="#233149" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#fff", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#fff", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "none",
                          borderRadius: 12,
                          color: "#fff",
                        }}
                      />
                      {TREND_LINES.map((line) => (
                        <Line
                          key={line.key}
                          type="monotone"
                          dataKey={line.key}
                          stroke={line.color}
                          strokeWidth={3}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-6">
                  {TREND_LINES.map((line) => (
                    <div key={line.key} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: line.color }}
                      />
                      <span className="text-[11px] uppercase tracking-wide text-white">
                        {line.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <aside className="space-y-6">
            {/* Mortgage calculator */}
            <div className="rounded-[24px] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Investment estimate
              </p>
              <p className="mt-2 text-4xl font-black text-slate-900">
                {formatCurrency(calcResults.estimatedMonthly)}
                <span className="text-base font-medium text-slate-400">
                  {" "}
                  /mo
                </span>
              </p>

              <div className="mt-6 space-y-4">
                <SliderField
                  label="Home price"
                  value={calculatorInputs.homePrice}
                  prefix="$"
                  min={200000}
                  max={5000000}
                  step={50000}
                  onChange={(v) =>
                    setCalculatorInputs((p) => ({ ...p, homePrice: v }))
                  }
                />
                <SliderField
                  label="Down payment"
                  value={calculatorInputs.downPaymentPercent}
                  suffix="%"
                  min={5}
                  max={50}
                  step={5}
                  onChange={(v) =>
                    setCalculatorInputs((p) => ({
                      ...p,
                      downPaymentPercent: v,
                    }))
                  }
                />
                <SliderField
                  label="Interest rate"
                  value={calculatorInputs.interestRate}
                  suffix="%"
                  min={2}
                  max={10}
                  step={0.1}
                  onChange={(v) =>
                    setCalculatorInputs((p) => ({ ...p, interestRate: v }))
                  }
                />
                <SliderField
                  label="Amortization"
                  value={calculatorInputs.termYears}
                  suffix=" yrs"
                  min={10}
                  max={30}
                  step={5}
                  onChange={(v) =>
                    setCalculatorInputs((p) => ({ ...p, termYears: v }))
                  }
                />
              </div>

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <CalcRow
                  label="Loan amount"
                  value={formatCurrency(calcResults.loanAmount)}
                />
                <CalcRow
                  label="Down payment"
                  value={formatCurrency(calcResults.downPayment)}
                />
                <CalcRow
                  label="Property tax (est.)"
                  value={`${formatCurrency(calcResults.propertyTaxMonthly)} / mo`}
                />
                <CalcRow
                  label="Closing costs (est.)"
                  value={`~${formatCurrency(calcResults.closingCosts)}`}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-green-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-green-700">
                  Affordability score
                </p>
                <p className="text-2xl font-black text-green-800">
                  {calcResults.score}
                </p>
              </div>
            </div>

            {/* Register / Inquiry */}
            <div className="overflow-hidden rounded-[24px] bg-[#06132e] shadow-xl">
              <div className="bg-[#F58232] px-6 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-white" />
                  <h3 className="font-bold text-white">
                    Register for Platinum Access
                  </h3>
                </div>
                <p className="mt-1 text-xs text-orange-100">
                  Be first to receive pricing, floor plans &amp; VIP incentives.
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="First name"
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#F58232]"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#F58232]"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="col-span-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#F58232]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    className="col-span-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#F58232]"
                  />
                </div>
                <textarea
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#F58232]"
                />
                <button
                  type="button"
                  className="mt-4 w-full rounded-full bg-[#F58232] py-3 text-sm font-bold text-white transition hover:bg-[#e67428]"
                >
                  Get Platinum Access
                </button>

                <div className="mt-5 flex justify-center gap-8">
                  <button className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20">
                    <Phone size={15} />
                    Call
                  </button>
                  <button className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20">
                    <Mail size={15} />
                    Email
                  </button>
                </div>
              </div>
            </div>

            {/* Key facts */}
            <div className="rounded-[24px] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Key Project Facts
              </h3>
              <div className="mt-5 space-y-4">
                <FactRow
                  icon={<Building2 size={18} />}
                  label="Developer"
                  value={project?.developer_name || "—"}
                />
                <FactRow
                  icon={<Calendar size={18} />}
                  label="Occupancy"
                  value={project?.occupancy || project?.occupancy_date || "TBD"}
                />
                <FactRow
                  icon={<Layers size={18} />}
                  label="Total Storeys"
                  value={project?.storeys ? `${project.storeys} floors` : "—"}
                />
                <FactRow
                  icon={<Users size={18} />}
                  label="Total Suites"
                  value={project?.units || "—"}
                />
                <FactRow
                  icon={<DollarSign size={18} />}
                  label="Maintenance"
                  value={project?.maint || "—"}
                />
                <FactRow
                  icon={<Clock size={18} />}
                  label="Status"
                  value={statusBadge?.text || "—"}
                />
              </div>
            </div>
          </aside>
        </section>

        {/* ── Map ── */}
        <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-6">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">Location</h2>
          <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">
            {mapUrl ? (
              <iframe
                title="Project location map"
                src={mapUrl}
                className="h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-slate-100 text-slate-500">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 text-slate-300" />
                  <p>
                    {[project?.addr, project?.municipality]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="mx-auto mt-10 max-w-7xl px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-[28px] bg-[#06132e] px-8 py-12 text-center shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F58232]/10 to-transparent" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F58232]/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#F58232]">
                <Sparkles size={12} />
                Exclusive Platinum Access
              </span>
              <h2 className="mt-4 text-3xl font-black text-white">
                Don't miss the VIP launch of {project?.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
                Register now to lock in pre-public pricing, choose your
                preferred floor plan, and access developer incentives before
                they're gone.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  className="rounded-full bg-[#F58232] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#e67428]"
                >
                  Register Now — It's Free
                </button>
                <Link
                  href="/preconstruction"
                  className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ── Helper components ── */

function PCStatChip({ icon: Icon, value, label }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto mb-2 text-[#F58232]" size={20} />
      <p className="text-base font-bold text-slate-900">{value || "—"}</p>
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

function PCDetailItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 font-medium">{value || "—"}</p>
    </div>
  );
}

function FloorPlanCard({ model }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      {model.thumbnail && (
        <img
          src={model.thumbnail}
          alt={model.name}
          className="mb-3 h-32 w-full rounded-xl object-cover"
        />
      )}
      <p className="font-semibold text-white">{model.name || "Suite"}</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
        {model.br && <span>{model.br} bed</span>}
        {model.bath && <span>{model.bath} bath</span>}
        {model.sqft && <span>{model.sqft} sqft</span>}
      </div>
      {model.lp_dol_text && (
        <p className="mt-2 text-sm font-bold text-[#F58232]">
          {model.lp_dol_text}
        </p>
      )}
    </div>
  );
}

function FactRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#F58232]">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function CalcRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function SliderField({
  label,
  value,
  prefix,
  suffix,
  min,
  max,
  step,
  onChange,
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer accent-[#F58232]"
      />
    </div>
  );
}

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-[#F58232] border-t-transparent" />
        <p className="text-sm font-medium text-slate-600">Loading project…</p>
      </div>
    </div>
  );
}

export default function PreConstructionProjectPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <PreConstructionDetailContent />
    </Suspense>
  );
}
