import { motion } from "framer-motion";
import {
  BedDouble,
  Bath,
  MoveHorizontal,
  Share2,
  ChevronRight,
} from "lucide-react";
import Bookmark from "./Bookmark";

import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getListingUrl, stashListing, getListingOffer } from "@/lib/listing-url";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
    },
  }),
};

const ListingCards = ({ listing }) => {
  const [Compare, setCompare] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const sync = () => {
      const stored = JSON.parse(localStorage.getItem("Compare")) || [];
      setCompare(stored);
    };
    sync();
    window.addEventListener("compare:updated", sync);
    return () => window.removeEventListener("compare:updated", sync);
  }, []);

  const toggleCompare = (listing) => {
    const stored = JSON.parse(localStorage.getItem("Compare")) || [];

    const exists = stored.find((item) => item.id === listing.id);

    let updated;

    if (exists) {
      updated = stored.filter((item) => item.id !== listing.id);

      toast.success("Removed from compare list");
    } else {
      updated = [...stored, listing];

      toast.success("Added to compare list");
    }

    localStorage.setItem("Compare", JSON.stringify(updated));
    window.dispatchEvent(new Event("compare:updated"));

    setCompare(updated);
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

  const handleClick = (listing) => {
    stashListing(listing);
    router.push(getListingUrl(listing));
  };

  const offer = getListingOffer(listing);
  const isRent = offer.kind === "rent";
  const priceText = String(listing.lp_dol_text || "");
  const showMonthly =
    isRent && !/\/\s*(mth|mo|month)/i.test(priceText);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        whileHover={{ y: -6 }}
        className="group overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all"
      >
        <div
          className="relative h-[190px] overflow-hidden  "
          onClick={() => handleClick(listing)}
        >
          <img
            src={listing.thumbnail}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-900 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t  from-black/80 via-black/10 to-transparent" />

          <span
            className={`absolute bottom-3 left-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
              isRent
                ? "bg-sky-500 text-white"
                : "bg-[#F6722B] text-white"
            }`}
          >
            {offer.label}
          </span>

          <div className="absolute left-4 right-4 top-4 flex justify-between items-center">
            {(Array.isArray(listing.badges1) ? listing.badges1 : [])
              .slice(0, 2)
              .map((badge, idx) => (
                <span
                  key={idx}
                  className={`rounded-full ${idx === 0 ? "bg-white/30 text-[#111827]" : "text-white bg-black/50"}  px-3 py-1 text-xs font-semibold text-[#111827] backdrop-blur-md`}
                >
                  {badge?.text}
                </span>
              ))}
          </div>
        </div>

        <div className="p-3.5 sm:p-4 text-black">
          <h3 className="line-clamp-1 text-xl font-bold ">
            {priceText || "—"}
            {showMonthly ? (
              <span className="text-sm font-medium text-slate-500"> /mth</span>
            ) : null}
          </h3>

          <span
            className={`mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
              isRent
                ? "bg-sky-50 text-sky-800 ring-1 ring-sky-200"
                : "bg-orange-50 text-[#C2410C] ring-1 ring-orange-200"
            }`}
          >
            {offer.label}
          </span>

          <div className="mt-2 flex items-start gap-2">
            <p className="line-clamp-2 text-sm leading-6 text-black">
              {listing.addr}, {listing.community}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="flex items-center gap-2 rounded-full bg-[#F7F8FA] px-2 text-[13px] font-medium text-black">
              <BedDouble size={13} />
              {listing.br}
            </span>

            <span className="flex items-center gap-2 rounded-full bg-[#F7F8FA] px-2  text-[13px] font-medium text-black">
              <Bath size={13} />
              {listing.bath_tot}
            </span>

            <span className="flex items-center gap-2 rounded-full bg-[#F7F8FA] px-2 text-[13px] font-medium text-black">
              <MoveHorizontal size={13} />
              {listing.sqft}
            </span>
          </div>

          <p className=" text-[13px] my-2 text-black">MLS# {listing.id}</p>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 border-t border-[#F3F4F6] pt-2">
            <button
              onClick={() => toggleCompare(listing)}
              className={`flex items-center gap-1.5 rounded-xl ${Compare.some((f) => f.id === listing.id) ? "bg-[#F6722B] text-white" : "hover:bg-[#F6722B] hover:text-white"} px-2.5 py-1.5 text-xs transition-all`}
            >
              <b>
                {Compare.some((f) => f.id === listing.id) ? "Added" : "Compare"}
              </b>
            </button>

            <button
              onClick={() => {
                handleClick(listing);
              }}
              className="flex items-center gap-1 rounded-xl hover:bg-[#F6722B] hover:text-white px-2.5 py-1.5 text-xs transition-all"
            >
              <b>View Details</b>
              <ChevronRight size={15} />
            </button>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => handleShare(listing)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border text-[#6B7280] transition-all hover:border-[#F97316] hover:text-[#F97316]"
              >
                <Share2 size={14} />
              </button>
              <Bookmark listing={listing} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ListingCards;
