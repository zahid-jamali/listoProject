"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

const LocationContext = createContext(null);

export const DEFAULT_LOCATION = {
  name: "Toronto",
  munc_slug: "toronto",
  loc_type: "MUNC",
  count: 1237,
};

function formatCityName(slug = "") {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function persistLocation(locationObj) {
  try {
    sessionStorage.setItem(
      "user_selected_location",
      JSON.stringify(locationObj),
    );
  } catch (err) {
    console.error("Failed to save location to sessionStorage:", err);
  }
}

async function reverseGeocodeCity(latitude, longitude) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  if (!res.ok) return null;

  const data = await res.json();
  const address = data.address || {};
  const detectedCity =
    address.city ||
    address.town ||
    address.municipality ||
    address.county ||
    address.state_district ||
    "";

  if (!detectedCity) return null;

  return {
    name: detectedCity,
    munc_slug: detectedCity.toLowerCase().replace(/\s+/g, "-"),
    loc_type: "MUNC",
    lat: latitude,
    lon: longitude,
  };
}

function matchMarket(detected, marketsList) {
  if (!detected) return null;
  const slug = detected.munc_slug;
  const name = detected.name.toLowerCase();

  return (
    marketsList.find(
      (m) =>
        m.munc_slug === slug ||
        m.name.toLowerCase() === name ||
        slug.includes(m.munc_slug) ||
        m.munc_slug.includes(slug),
    ) || null
  );
}

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocationState] =
    useState(DEFAULT_LOCATION);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [marketsList, setMarketsList] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [locating, setLocating] = useState(false);
  const marketsListRef = useRef([]);
  const hasAskedGpsRef = useRef(false);

  const setLocation = useCallback((location) => {
    if (!location) return;
    const locationObj = {
      name: location.name || formatCityName(location.munc_slug),
      munc_slug: location.munc_slug,
      loc_type: location.loc_type || "MUNC",
      count: location.count || 0,
      lat: location.lat || null,
      lon: location.lon || null,
    };

    setSelectedLocationState(locationObj);
    persistLocation(locationObj);
    setIsLocationModalOpen(false);
  }, []);

  // First visit: no popup — ask browser geolocation; deny → Toronto
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const stored = sessionStorage.getItem("user_selected_location");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.munc_slug) {
            setSelectedLocationState(parsed);
            setIsInitialized(true);
            return;
          }
        }
      } catch (err) {
        console.error("Error reading location from sessionStorage:", err);
      }

      // Default Toronto in UI while browser permission prompt is open
      // (do not persist yet — so a refresh can re-ask GPS)
      setSelectedLocationState(DEFAULT_LOCATION);
      setIsInitialized(true);

      if (hasAskedGpsRef.current) return;
      hasAskedGpsRef.current = true;

      if (typeof navigator === "undefined" || !navigator.geolocation) {
        return;
      }

      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (cancelled) return;
          const { latitude, longitude } = position.coords;
          try {
            const detected = await reverseGeocodeCity(latitude, longitude);
            if (cancelled || !detected) return;

            // Prefer picklist match if already loaded
            const match = matchMarket(detected, marketsListRef.current);
            setLocation(
              match
                ? { ...match, lat: latitude, lon: longitude }
                : detected,
            );
          } catch (err) {
            console.error("Geocoding lookup error:", err);
          } finally {
            if (!cancelled) setLocating(false);
          }
        },
        (error) => {
          console.warn("Geolocation denied or failed:", error);
          if (!cancelled) {
            setLocating(false);
            setLocation(DEFAULT_LOCATION);
          }
        },
        { timeout: 12000, enableHighAccuracy: false, maximumAge: 60000 },
      );
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Fetch picklist markets
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoadingMarkets(true);
        const res = await fetch("/api/picklist_inv_listings");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const formatted = data.map((item) => ({
              munc_slug: item.munc_slug,
              name: formatCityName(item.munc_slug),
              count: Number(item.count || 0),
              loc_type: "MUNC",
            }));
            setMarketsList(formatted);
            marketsListRef.current = formatted;
          }
        }
      } catch (err) {
        console.error("Error fetching picklist markets:", err);
      } finally {
        setLoadingMarkets(false);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        marketsList,
        loadingMarkets,
        isInitialized,
        locating,
        DEFAULT_LOCATION,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used inside a LocationProvider");
  }
  return ctx;
}
