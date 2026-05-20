// src/components/home/PropertyReels.jsx

"use client";

import Link from "next/link";
import { ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

import { useRef, useState } from "react";

const reels = [
  {
    id: 1,
    title: "Whitby 3 Bed 2 Bath $637,830",
    category: "Home Tour",
    thumbnail: "/assets/reel1.jpg",
    video: "/assets/reel1.mp4",
  },
  {
    id: 2,
    title: "Scarborough 4 Bed 2 Bath $749,888",
    category: "Home Tour",
    thumbnail: "/assets/reel2.jpg",
    video: "/assets/reel2.mp4",
  },
  {
    id: 3,
    title: "Dubai Property Sobha",
    category: "Pre-Construction",
    thumbnail: "/assets/reel3.jpg",
    video: "/assets/reel3.mp4",
  },
];

export default function PropertyReels() {
  return (
    <section className="w-full bg-[#f7f7f7] py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[34px] font-extrabold tracking-[-1px] text-black lg:text-[42px]">
                Property Reels
              </h2>

              <p className="mt-2 text-[15px] text-neutral-500">
                Watch premium property walkthroughs and tours
              </p>
            </div>

            <Link
              href="/reels"
              className="hidden items-center gap-2 text-[15px] font-semibold text-[#F58233] transition-all duration-300 hover:gap-3 md:flex"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* REELS GRID */}
          <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>

          {/* MOBILE BUTTON */}
          <div className="mt-10 flex justify-center md:hidden">
            <Link
              href="/reels"
              className="flex items-center gap-2 rounded-xl border border-[#F58233] px-6 py-3 text-[15px] font-semibold text-[#F58233]"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReelCard({ reel }) {
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-black shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      {/* VIDEO CONTAINER */}

      <div className="container mx-auto">
        <div className="relative aspect-[12/13] overflow-hidden">
          {/* VIDEO */}
          <video
            ref={videoRef}
            poster={reel.thumbnail}
            muted
            loop
            playsInline
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          >
            <source src={reel.video} type="video/mp4" />
          </video>

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />

          {/* CATEGORY BADGE */}
          <div className="absolute left-4 top-4">
            <div className="rounded-full bg-[#F58233] px-4 py-1.5 text-[12px] font-semibold text-white shadow-lg">
              {reel.category}
            </div>
          </div>

          {/* PLAY BUTTON */}
          <button
            onClick={togglePlay}
            className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/30"
          >
            {playing ? (
              <Pause size={28} className="fill-white text-white" />
            ) : (
              <Play size={28} className="ml-1 fill-white text-white" />
            )}
          </button>

          {/* MUTE BUTTON */}
          <button
            onClick={toggleMute}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-all duration-300 hover:bg-black/50"
          >
            {muted ? (
              <VolumeX size={18} className="text-white" />
            ) : (
              <Volume2 size={18} className="text-white" />
            )}
          </button>

          {/* BOTTOM CONTENT */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* TITLE */}
            <h3 className="line-clamp-2 text-[18px] font-semibold leading-[28px] text-white">
              {reel.title}
            </h3>

            {/* SMALL TEXT */}
            <p className="mt-2 text-[13px] text-white/70">
              Luxury Property Tour
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
