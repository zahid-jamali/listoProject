"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  DollarSign,
  Percent,
  Calendar,
  MapPin,
  School,
  ShoppingBag,
  Train,
  Star,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Eye,
  Navigation,
  Building,
  Maximize2,
  Bath,
  Bed,
  Award,
  Clock,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  X,
} from "lucide-react";

const PropertyPage = () => {
  const [activeTab, setActiveTab] = useState("property");
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [calculatorInputs, setCalculatorInputs] = useState({
    homePrice: 799000,
    downPaymentPercent: 20,
    interestRate: 5.4,
    termYears: 25,
  });
  const [calculatorResults, setCalculatorResults] = useState({
    downPayment: 159800,
    loanAmount: 639200,
    mortgageMonthly: 3887,
    propertyTaxMonthly: 402,
    closingCostsEstimate: 22000,
    estimatedMonthly: 3887,
    affordabilityScore: "A-",
  });

  const fetchData = async () => {
    try {
      const myObject = sessionStorage.getItem("PG");
      if (!myObject) {
        // For demo purposes, use the API response data directly if no session data
        loadDemoData();
        setLoading(false);
        return;
      }
      const res = await fetch("/api/project-details", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: myObject,
      });

      const data = await res.json();
      console.log(data);
      processApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const processApiData = (data) => {
    if (data && data.success) {
      // Process hero data
      const hero = data.hero || {};
      const photos = hero.photos || [];

      // Process calculator data
      if (data.calculator && data.calculator.inputs) {
        const inputs = data.calculator.inputs;
        const results = data.calculator.results || {};
        setCalculatorInputs({
          homePrice: inputs.homePrice || 799000,
          downPaymentPercent: inputs.downPaymentPercent || 20,
          interestRate: inputs.interestRate || 5.4,
          termYears: inputs.termYears || 25,
        });
        setCalculatorResults({
          downPayment:
            results.downPayment ||
            (inputs.homePrice * (inputs.downPaymentPercent || 20)) / 100 ||
            159800,
          loanAmount:
            results.loanAmount ||
            (inputs.homePrice * (100 - (inputs.downPaymentPercent || 20))) /
              100 ||
            639200,
          mortgageMonthly: results.mortgageMonthly || 3887,
          propertyTaxMonthly: results.propertyTaxMonthly || 402,
          closingCostsEstimate: results.closingCostsEstimate || 22000,
          estimatedMonthly: results.estimatedMonthly || 3887,
          affordabilityScore: results.affordabilityScore || "A-",
        });
      }

      // Store the full data for rendering
      setPropertyData(data);
    }
  };

  const loadDemoData = () => {
    // Use the API response structure as demo data
    setPropertyData({
      success: true,
      hero: {
        photos: [
          {
            src: "https://images.listo.ca/listo/prj/imgs/34d2b42f-b720-44e3-a139-7ea68ce8ba56",
          },
          {
            src: "https://images.listo.ca/listo/prj/imgs/4398eddf-f323-4c22-8c62-df057adc771c",
          },
          {
            src: "https://images.listo.ca/listo/prj/imgs/286e5691-93e3-4baa-b7f9-1d02e690feea",
          },
          {
            src: "https://images.listo.ca/listo/prj/imgs/a0b8fb72-44a9-440a-9ccc-300c6678ed8e",
          },
          {
            src: "https://images.listo.ca/listo/prj/imgs/b66cedd2-608d-4896-afc5-7bb402416fca",
          },
        ],
      },
      marketTrends: [
        {
          date: "2026-05-01",
          detached_avg_sold_price: "1273900",
          semi_detached_avg_sold_price: "910000",
          twnhouse_avg_sold_price: "882000",
          condo_apt_avg_sold_price: "510000",
        },
        {
          date: "2026-04-01",
          detached_avg_sold_price: "1232300",
          semi_detached_avg_sold_price: "911500",
          twnhouse_avg_sold_price: "850000",
          condo_apt_avg_sold_price: "495000",
        },
        {
          date: "2026-03-01",
          detached_avg_sold_price: "1292000",
          semi_detached_avg_sold_price: "915200",
          twnhouse_avg_sold_price: "900000",
          condo_apt_avg_sold_price: "495000",
        },
        {
          date: "2026-02-01",
          detached_avg_sold_price: "1238000",
          semi_detached_avg_sold_price: "890000",
          twnhouse_avg_sold_price: "931000",
          condo_apt_avg_sold_price: "487500",
        },
        {
          date: "2026-01-01",
          detached_avg_sold_price: "1190000",
          semi_detached_avg_sold_price: "901000",
          twnhouse_avg_sold_price: "857500",
          condo_apt_avg_sold_price: "495000",
        },
        {
          date: "2025-12-01",
          detached_avg_sold_price: "1215000",
          semi_detached_avg_sold_price: "899000",
          twnhouse_avg_sold_price: "922500",
          condo_apt_avg_sold_price: "490000",
        },
      ],
      contact: {
        quickActions: [
          "Book a Tour",
          "Financing Help",
          "Ask About Schools",
          "Offer Strategy",
          "Similar Homes",
        ],
        defaultMessage:
          "I'm interested in this property. Please contact me with more information.",
      },
      localCards: {
        recentSolds: { title: "Recent Solds", location: "Hamilton" },
        priceChanges: { title: "Price changes", location: "Hamilton" },
        assignmentSales: { title: "Assignment Sales", location: "Hamilton" },
        openHouses: { title: "Open Houses", location: "Hamilton" },
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateCalculator = (field, value) => {
    const newInputs = { ...calculatorInputs, [field]: value };
    setCalculatorInputs(newInputs);

    // Recalculate results
    const homePrice = newInputs.homePrice;
    const downPaymentPercent = newInputs.downPaymentPercent;
    const interestRate = newInputs.interestRate;
    const termYears = newInputs.termYears;

    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = termYears * 12;
    const mortgageMonthly =
      monthlyRate === 0
        ? loanAmount / numberOfPayments
        : (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const propertyTaxMonthly = (homePrice * 0.006) / 12; // Approximate 0.6% annual property tax
    const estimatedMonthly = Math.round(mortgageMonthly + propertyTaxMonthly);

    let affordabilityScore = "A+";
    const monthlyIncome = 15000; // Assuming $180k annual income
    const dti = (estimatedMonthly / monthlyIncome) * 100;
    if (dti > 39) affordabilityScore = "B+";
    if (dti > 43) affordabilityScore = "C";
    if (dti > 50) affordabilityScore = "D";

    setCalculatorResults({
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      mortgageMonthly: Math.round(mortgageMonthly),
      propertyTaxMonthly: Math.round(propertyTaxMonthly),
      closingCostsEstimate: Math.round(homePrice * 0.0275), // ~2.75% closing costs
      estimatedMonthly: estimatedMonthly,
      affordabilityScore: affordabilityScore,
    });
  };

  const nextPhoto = () => {
    const photos = propertyData?.hero?.photos || [];
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    const photos = propertyData?.hero?.photos || [];
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  const photos = propertyData?.hero?.photos || [];
  const heroImage = photos.length > 0 ? photos[0].src : null;
  const marketTrends = propertyData?.marketTrends || [];
  const quickActions = propertyData?.contact?.quickActions || [
    "Book a Tour",
    "Financing Help",
    "Ask About Schools",
    "Offer Strategy",
    "Similar Homes",
  ];
  const localCards = propertyData?.localCards || {};
  const recentSoldsLocation = localCards.recentSolds?.location || "Hamilton";
  const priceChangesLocation = localCards.priceChanges?.location || "Hamilton";
  const assignmentSalesLocation =
    localCards.assignmentSales?.location || "Hamilton";
  const openHousesLocation = localCards.openHouses?.location || "Hamilton";

  // Prepare chart data from market trends (last 6 months)
  const chartData = marketTrends.slice(0, 6).reverse();
  const maxPrice = Math.max(
    ...chartData.flatMap((d) => [
      parseFloat(d.detached_avg_sold_price) || 0,
      parseFloat(d.semi_detached_avg_sold_price) || 0,
      parseFloat(d.twnhouse_avg_sold_price) || 0,
      parseFloat(d.condo_apt_avg_sold_price) || 0,
    ])
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Photo Modal */}
      {showPhotoModal && photos.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowPhotoModal(false)}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
          >
            <X size={24} />
          </button>
          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"
          >
            <ChevronRight size={24} />
          </button>
          <img
            src={photos[currentPhotoIndex]?.src}
            alt={`Property photo ${currentPhotoIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Header / Property Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            69 Horseley Hill Drive
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-gray-500">
            <span>Malvern Elite District</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-red-600 font-semibold">
              $1,250,000 LISTING PRICE
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-6 rounded-xl overflow-hidden bg-gray-200 h-64 md:h-96">
          {heroImage ? (
            <img
              src={heroImage}
              alt="Property"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => {
                setCurrentPhotoIndex(0);
                setShowPhotoModal(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
              <Home size={48} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-between p-4">
            {photos.length > 0 && (
              <button
                onClick={() => {
                  setCurrentPhotoIndex(0);
                  setShowPhotoModal(true);
                }}
                className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg"
              >
                <Eye size={18} /> VIEW ALL PHOTOS ({photos.length})
              </button>
            )}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg">
              SIGN IN TO VIEW
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 text-sm">BEDS</span>
            <p className="text-2xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 text-sm">BATHS</span>
            <p className="text-2xl font-bold text-gray-900">4</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 text-sm">SQFT</span>
            <p className="text-2xl font-bold text-gray-900">3,100</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 text-sm">PROPERTY TYPE</span>
            <p className="text-lg font-semibold text-gray-900">Triplex</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {["Property", "Details", "Room Sizes"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === tab.toLowerCase().replace(" ", "")
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* MLS & Specs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 text-sm">MLS #:</span>{" "}
                  <p className="font-medium">X13079728</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Status:</span>{" "}
                  <p className="font-medium text-green-600">Active</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Property Style:</span>{" "}
                  <p className="font-medium">2-Storey</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Year Built:</span>{" "}
                  <p className="font-medium">0-5</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Outside:</span>{" "}
                  <p className="font-medium">Stucco (Plaster) Vinyl Siding</p>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Property Features</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Fenced Yard",
                  "Park",
                  "Public Transit",
                  "School",
                  "Rec./Commun. Centre",
                ].map((feature) => (
                  <span
                    key={feature}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Neighborhood Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Neighborhood Overview
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Complete neighborhood profile for 68 Vansitmart Avenue
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-2xl font-bold text-green-600">
                    92
                  </span>
                  <span className="text-xs text-gray-500">Very Walkable</span>
                  <p className="text-xs">Most errands on foot</p>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-yellow-600">
                    68
                  </span>
                  <span className="text-xs text-gray-500">Good Transit</span>
                  <p className="text-xs">A few options</p>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600">
                    54
                  </span>
                  <span className="text-xs text-gray-500">Bikeable</span>
                  <p className="text-xs">Some infrastructure</p>
                </div>
              </div>
            </div>

            {/* Location Information with Map Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Location Information
              </h3>
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 flex items-center justify-center gap-4 text-gray-400">
                  <School size={24} />
                  <ShoppingBag size={24} />
                  <Train size={24} />
                </div>
                <span className="bg-white px-3 py-1 rounded-full shadow text-sm z-10">
                  Map View
                </span>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>📍 Nearby Schools</span>
                <span>🛍️ Shops & Restaurants</span>
                <span>🚆 Commute Options</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Cost Calculator & Contact */}
          <div className="space-y-6">
            {/* Cost Breakdown Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                SEE WHAT OWNING THIS HOME ACTUALLY COSTS.
              </p>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between items-center">
                  <span>Home Price</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      ${calculatorInputs.homePrice.toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        updateCalculator(
                          "homePrice",
                          Math.max(100000, calculatorInputs.homePrice - 50000)
                        )
                      }
                      className="text-gray-400 hover:text-gray-600 px-1"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        updateCalculator(
                          "homePrice",
                          calculatorInputs.homePrice + 50000
                        )
                      }
                      className="text-gray-400 hover:text-gray-600 px-1"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {calculatorInputs.downPaymentPercent}%
                    </span>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={calculatorInputs.downPaymentPercent}
                      onChange={(e) =>
                        updateCalculator(
                          "downPaymentPercent",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {calculatorInputs.interestRate}%
                    </span>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.1"
                      value={calculatorInputs.interestRate}
                      onChange={(e) =>
                        updateCalculator(
                          "interestRate",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Term</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {calculatorInputs.termYears} yrs
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      step="5"
                      value={calculatorInputs.termYears}
                      onChange={(e) =>
                        updateCalculator("termYears", parseInt(e.target.value))
                      }
                      className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="text-center">
                  <span className="text-gray-500 text-sm">
                    ESTIMATED MONTHLY
                  </span>
                  <p className="text-4xl font-bold text-gray-900">
                    ${calculatorResults.estimatedMonthly.toLocaleString()}{" "}
                    <span className="text-lg font-normal">/MO</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mt-3">
                  <div>
                    Loan amount{" "}
                    <span className="block font-medium text-gray-800">
                      ${calculatorResults.loanAmount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Down payment{" "}
                    <span className="block font-medium text-gray-800">
                      ${calculatorResults.downPayment.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    Property tax (est.){" "}
                    <span className="block font-medium text-gray-800">
                      ${calculatorResults.propertyTaxMonthly.toLocaleString()} /
                      mo
                    </span>
                  </div>
                  <div>
                    Closing costs (est.){" "}
                    <span className="block font-medium text-gray-800">
                      ~$
                      {calculatorResults.closingCostsEstimate.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg mb-4">
                <span className="font-bold text-green-800">
                  Affordability score
                </span>
                <span className="text-2xl font-black text-green-700">
                  {calculatorResults.affordabilityScore}
                </span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Get pre-approved in 60s
              </button>
            </div>

            {/* Contact Agent Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    👩
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Mitchell</h4>
                    <p className="text-xs text-gray-500">Contact Agent</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    17 buyers contacted Sarah this week
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    ★★★★★ <span className="text-gray-600">4.98 avg</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                  <Phone size={14} /> Call
                </button>
                <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                  <Mail size={14} /> Email
                </button>
                <button className="flex-1 bg-gray-100 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                  <MessageCircle size={14} /> Chat
                </button>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-3">
                  Need help exploring this home?
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((btn) => (
                    <button
                      key={btn}
                      className="bg-gray-50 border border-gray-200 text-xs px-3 py-1.5 rounded-full hover:bg-gray-100"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder={
                    propertyData?.contact?.defaultMessage ||
                    "I'm interested in this property. Please contact me with more information."
                  }
                  className="w-full p-3 border rounded-lg text-sm pr-20"
                />
                <button className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-md text-sm">
                  Send
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              <button className="text-left bg-white p-3 rounded-lg shadow-sm text-sm font-medium hover:shadow transition flex justify-between items-center">
                Recent Solds In {recentSoldsLocation}
                <ChevronRight size={16} />
              </button>
              <button className="text-left bg-white p-3 rounded-lg shadow-sm text-sm font-medium hover:shadow transition flex justify-between items-center">
                Price changes In {priceChangesLocation}
                <ChevronRight size={16} />
              </button>
              <button className="text-left bg-white p-3 rounded-lg shadow-sm text-sm font-medium hover:shadow transition flex justify-between items-center">
                Assignment Sales In {assignmentSalesLocation}
                <ChevronRight size={16} />
              </button>
              <button className="text-left bg-white p-3 rounded-lg shadow-sm text-sm font-medium hover:shadow transition flex justify-between items-center">
                Open Houses In {openHousesLocation}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison & Market Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Active Comparisons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} /> Active Comparisons
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Compare live listings with precision data.
            </p>
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <span className="text-2xl font-bold">$749,900</span>
                  <p className="font-medium">
                    55 Allan Avenue, Homeside, Hamilton
                  </p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>🛏️ 4 Beds</span>
                    <span>🛁 4 Baths</span>
                    <span>📏 1,100–1,500 sqft</span>
                  </div>
                </div>
                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                  -26k
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-2xl font-bold">$825,000</span>
                  <p className="font-medium">
                    44 Venture Avenue{" "}
                    <span className="text-gray-400 text-sm">1 Km away</span>
                  </p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>🛏️ 3 Beds</span>
                    <span>🛁 4 Baths</span>
                    <span>📏 1,100–1,500 sqft</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <Sparkles size={16} /> AI Summary
              </div>
              <ul className="text-sm text-gray-700 mt-2 list-disc pl-5 space-y-1">
                <li>100 Good offers a better price (-$26k)</li>
                <li>100 Good provides one extra bedroom</li>
                <li>44 Venture has slightly larger backyard</li>
              </ul>
              <p className="text-sm italic mt-2">
                "100 Good offers stronger overall family value."
              </p>
            </div>
          </div>

          {/* Sold Comparisons + Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Sold Comparisons
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Access real-time sold data for smarter pricing.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <span className="text-xl font-bold">$749,900</span>
                  <p>55 Allan Avenue, Homeside, Hamilton</p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    4 Beds · 4 Baths · 1,100–1,500 sqft
                  </div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Sold
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold">$825,000</span>
                  <p>44 Venture Avenue · 1 Km away</p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    3 Beds · 4 Baths · 1,100–1,500 sqft
                  </div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  Sold
                </span>
              </div>
            </div>
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-sm">
                Mississauga home prices — 6-month valuation trend across all
                asset classes
              </p>
              <div className="h-48 mt-2 relative">
                <div className="flex items-end gap-1 h-40">
                  {chartData.map((item, idx) => {
                    const detached =
                      parseFloat(item.detached_avg_sold_price) || 0;
                    const semi =
                      parseFloat(item.semi_detached_avg_sold_price) || 0;
                    const townhouse =
                      parseFloat(item.twnhouse_avg_sold_price) || 0;
                    const condo =
                      parseFloat(item.condo_apt_avg_sold_price) || 0;
                    const maxVal = Math.max(
                      detached,
                      semi,
                      townhouse,
                      condo,
                      1
                    );
                    const monthNames = [
                      "Nov",
                      "Dec",
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                    ];
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full flex flex-col gap-0.5">
                          <div
                            className="w-full bg-blue-500 rounded-t"
                            style={{
                              height: `${(detached / maxPrice) * 80}px`,
                            }}
                          ></div>
                          <div
                            className="w-full bg-green-500 rounded-t"
                            style={{ height: `${(semi / maxPrice) * 80}px` }}
                          ></div>
                          <div
                            className="w-full bg-yellow-500 rounded-t"
                            style={{
                              height: `${(townhouse / maxPrice) * 80}px`,
                            }}
                          ></div>
                          <div
                            className="w-full bg-purple-500 rounded-t"
                            style={{ height: `${(condo / maxPrice) * 80}px` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">
                          {monthNames[idx % monthNames.length]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                <span>
                  <span className="w-2 h-2 bg-blue-500 inline-block rounded-full mr-1"></span>
                  Detached
                </span>
                <span>
                  <span className="w-2 h-2 bg-green-500 inline-block rounded-full mr-1"></span>
                  Semi
                </span>
                <span>
                  <span className="w-2 h-2 bg-yellow-500 inline-block rounded-full mr-1"></span>
                  Townhouse
                </span>
                <span>
                  <span className="w-2 h-2 bg-purple-500 inline-block rounded-full mr-1"></span>
                  Condo
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <p className="font-semibold text-sm">
                Insights for 3067 Churchill Avenue
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {[
                  "Highest/Lowest priced active",
                  "Recent sales on same street",
                  "Postal code activity",
                  "Open houses",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Row: Location Insights + AI Insight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Market Insight Block */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">AI Market Insight</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="font-semibold">1. Income Potential:</span>{" "}
                <span>
                  This property features 3 separate, self-contained units with 6
                  bedrooms and 5 bathrooms.
                </span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold">2. Modern Design:</span>{" "}
                <span>
                  Fully rebuilt in 2024, the property boasts elegant finishes,
                  open-concept layouts.
                </span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold">3. Prime Location:</span>{" "}
                <span>
                  Located in a growing lakeside community with easy access to
                  parks, golf courses, and major highways.
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} /> Summary Valuation
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-500 text-sm">Estimated Value</p>
                <span className="text-2xl font-bold">$1.22M</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Confidence Score</p>
                <span className="text-xl font-bold text-green-600">92%</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">vs List Price</p>
                <span className="text-red-500 font-medium">-2.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
