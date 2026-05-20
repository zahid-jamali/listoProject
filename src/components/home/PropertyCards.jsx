"use client";

const cards = [
  {
    title: "Buy",
    description:
      "Browse live MLS listings across the GTA and get matched with a LISTO advisor who knows your neighbourhood.",
    button: "Start your search",
    image: "/assets/buy.png",
  },
  {
    title: "Rent",
    description:
      "Verified condo, house and basement rentals — updated daily, no listing-fee surprises.",
    button: "Browse rentals",
    image: "/assets/rent.png",
  },
  {
    title: "Pre-Construction",
    description:
      "Platinum-access pricing on upcoming towers, towns and detached projects before they hit the public.",
    button: "View new Launches",
    image: "/assets/preconstruction.png",
  },
  {
    title: "Sell",
    description:
      "A modern listing playbook — pro photography, targeted ads, and pricing built on real local data.",
    button: "Get your home value",
    image: "/assets/sell.png",
  },
];

export default function PropertyCards() {
  return (
    <section className="w-full bg-[#f7f7f7] py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
          {/* HEADING */}
          <h2 className="text-[30px] font-extrabold tracking-[-1px] text-black sm:text-[36px]">
            What are you looking for?
          </h2>

          {/* CARDS GRID */}
          <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`group relative flex min-h-[442px] w-full max-w-[287px] flex-col rounded-[18px] border bg-white p-5 transition-all duration-300 hover:-translate-y-2 hover:border-[#F58233] hover:shadow-[0_0_22px_rgba(245,130,51,0.16)] ${
                  card.active
                    ? ""
                    : "border-neutral-200 hover:border-[#F58233]/40"
                }`}
              >
                {/* IMAGE CONTAINER */}
                <div className="flex justify-center">
                  <div className="flex h-[182px] w-full items-center justify-center rounded-b-[22px] rounded-t-[120px] bg-[#FFE7D7]">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-[145px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="mt-6 flex flex-1 flex-col text-center">
                  {/* TITLE */}
                  <h3 className="text-[24px] font-bold tracking-[-0.5px] text-black lg:text-[24px]">
                    {card.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mt-4 flex-1 text-[14px] leading-[24px] text-neutral-600">
                    {card.description}
                  </p>

                  {/* BUTTON */}
                  <button className="mt-6 h-[46px] w-full rounded-[10px] border border-[#F58233] text-[14px] font-semibold text-[#F58233] transition-all duration-300 hover:bg-[#F58233] hover:text-white">
                    {card.button}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
