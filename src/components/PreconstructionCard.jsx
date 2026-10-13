import { motion } from "framer-motion";
import { Share2, ChevronRight } from "lucide-react";
import Bookmark from "./Bookmark";
import { ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProjectUrl, stashProject } from "@/lib/listing-url";
import ProjectQuickViewModal from "./modals/ProjectQuickViewModal";

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

const PreconstructionCard = ({ listing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleShare = async (listing) => {
    const shareUrl = `${window.location.origin}${getProjectUrl(listing)}`;

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
    stashProject(listing);
    router.push(getProjectUrl(listing));
  };

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        whileHover={{ y: -6 }}
        className="group overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all"
      >
        <div
          onClick={() => handleClick(listing)}
          className="relative h-[220px] overflow-hidden cursor-pointer"
        >
          <img
            src={listing.thumbnail || "https://placehold.co/600x400"}
            alt={listing.title || "Project"}
            className="h-full w-full object-cover transition-transform duration-900 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex justify-between items-center">
            {Array.isArray(listing.badges1) && listing.badges1[0]?.text ? (
              <span className="rounded-full bg-[#F6722B] text-white px-3 py-1 text-xs font-semibold backdrop-blur-md">
                {listing.badges1[0].text}
              </span>
            ) : (
              <div />
            )}

            {listing.photos && listing.photos.length > 0 ? (
              <span className="rounded-full flex flex-row items-center gap-1 px-3 py-1 text-xs font-semibold bg-[#111827] text-white backdrop-blur-md">
                <ImageIcon size={11} /> {listing.photos.length}
              </span>
            ) : null}
          </div>
        </div>

        <div className="p-2 bg-white p-4 text-black">
          <h3
            onClick={() => handleClick(listing)}
            className="line-clamp-1 text-xl font-bold cursor-pointer hover:text-[#F6722B] transition-colors"
          >
            {listing.title}
          </h3>

          <div className="mt-2  ">
            <p className="line-clamp-2 text-sm leading-6 text-black">
              {listing.addr}
            </p>

            <p className=" text-xs leading-6 text-black">
              By {listing.developer_name}
            </p>
          </div>

          <p className=" text-md my-2 text-[#F6722c] font-semibold">
            Starting {listing.lp_dol_text}
          </p>

          <div className="mt-2 flex items-center justify-between border-t border-[#F3F4F6] pt-2">
            {/* <button className="flex items-center gap-2 rounded-2xl hover:bg-[#F6722B]  hover:text-white px-3 py-2 text-xs  transition-all ">
              Compare
            </button> */}

            <button
              onClick={() => {
                handleClick(listing);
              }}
              className="flex items-center gap-2 rounded-xl hover:bg-[#F6722B]  hover:text-white px-3 py-2 text-xs  transition-all "
            >
              <b>View Details</b>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl hover:bg-[#F6722B]  hover:text-white px-5 py-2 text-xs  transition-all "
            >
              <b>View</b>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(listing)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border  text-[#6B7280] transition-all hover:border-[#F97316] hover:text-[#F97316]"
              >
                <Share2 size={15} />
              </button>
              <Bookmark listing={listing} />
            </div>
          </div>
        </div>
      </motion.div>

      <ProjectQuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listing={listing}
        onFullDetails={() => {
          setIsModalOpen(false);
          handleClick(listing);
        }}
      />
    </>
  );
};

export default PreconstructionCard;
