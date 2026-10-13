"use client";

import { useMemo } from "react";
import { Car } from "lucide-react";

export default function NearbyPlaces({ project = {}, nearbyPlaces: propNearbyPlaces }) {
  const nearbyList = useMemo(() => {
    if (propNearbyPlaces && propNearbyPlaces.length > 0) {
      return propNearbyPlaces;
    }
    const city = String(project?.municipality || "").toLowerCase();
    if (city.includes("toronto") || city.includes("gta") || city.includes("mississauga") || city.includes("vaughan") || city.includes("oakville") || city.includes("brampton")) {
      return [
        { name: "Toronto Pearson Airport", time: "20 Minutes" },
        { name: "Downtown Toronto", time: "25 Minutes" },
        { name: "Square One Shopping Centre", time: "12 Minutes" },
        { name: "Nearest GO Transit Station", time: "5 Minutes" },
      ];
    }
    if (city.includes("vancouver") || city.includes("burnaby") || city.includes("richmond") || city.includes("surrey") || city.includes("coquitlam")) {
      return [
        { name: "Vancouver Int'l Airport", time: "22 Minutes" },
        { name: "Downtown Vancouver", time: "18 Minutes" },
        { name: "Metropolis at Metrotown", time: "10 Minutes" },
        { name: "Nearest SkyTrain Station", time: "4 Minutes" },
      ];
    }
    return [
      { name: "Nearest Highway Access", time: "4 Minutes" },
      { name: "Local Shopping Center", time: "6 Minutes" },
      { name: "Community Park & Recreation", time: "5 Minutes" },
      { name: "International Airport", time: "25 Minutes" },
    ];
  }, [project?.municipality, propNearbyPlaces]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-[#F58232] tracking-tight">
        Nearby Places
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nearbyList.map((place, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:border-orange-200 transition duration-300"
          >
            <div className="h-12 w-12 bg-orange-50/40 rounded-2xl flex items-center justify-center text-[#F58232] group-hover:scale-110 transition duration-300">
              <Car size={20} />
            </div>
            <p className="text-xs font-black text-slate-900 mt-3 line-clamp-1">{place.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{place.time} drive</p>
          </div>
        ))}
      </div>
    </div>
  );
}
