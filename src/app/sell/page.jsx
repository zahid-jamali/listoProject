// app/sell/page.jsx

export default function SellPage() {
  const reasons = [
    {
      title: "Expand Your Reach To More Potential Buyers",
      description:
        "Listo is rapidly expanding, offering a unique advantage by seamlessly integrating resale and pre-construction listings, enabling you to connect with a diverse pool of potential buyers.",
      icon: "👍",
      dark: true,
    },
    {
      title: "Trusted Local Agents",
      description:
        "Listo agents are here to support you every step of the way, from expert pricing and marketing your home to assisting on moving day.",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Prominent Placement",
      description:
        "Secure prime visibility on Listo.ca, ensuring your home grabs attention from our vast network of account holders.",
      icon: "♡",
      dark: true,
    },
  ];

  return (
    <div className="container mx-auto mt-4">
      <main className="min-h-screen bg-[#f5f5f5]">
        {/* HERO */}
        <section className="py-20">
          <div className="mx-auto grid max-w-[1450px] grid-cols-1 items-center gap-14 px-4 lg:grid-cols-2 lg:px-8">
            {/* LEFT */}
            <div>
              {/* TITLE */}
              <h1 className="text-[52px] font-black tracking-[-0.05em] text-[#F36B22] lg:text-[64px]">
                Sell with Listo!
              </h1>

              {/* SUBTITLE */}
              <h2 className="mt-5 max-w-[650px] text-[34px] font-black leading-tight tracking-[-0.04em] text-[#0B132B] lg:text-[46px]">
                Maximize Profits and Minimize Expenses.
              </h2>

              {/* TEXT */}
              <div className="mt-8 max-w-[620px] space-y-5">
                <p className="text-[17px] leading-8 text-neutral-600">
                  Maximize your home’s selling price while saving significantly
                  on fees.
                </p>

                <p className="text-[17px] leading-8 text-neutral-600">
                  Benefit from our agents’ expertise in pricing, marketing, and
                  selling your home at its highest value, all while paying a
                  fraction of the fee typically charged by other brokerages.
                </p>
              </div>

              {/* BUTTONS */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button className="rounded-full bg-gradient-to-r from-[#F36B22] to-[#ff8c4d] px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(243,107,34,0.35)] transition-all duration-300 hover:scale-105">
                  Start Selling →
                </button>

                <button className="rounded-full border border-neutral-300 bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#0B132B] transition-all duration-300 hover:border-[#F36B22] hover:text-[#F36B22]">
                  Learn More
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative overflow-hidden rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              {/* YOU WILL SET IMAGE */}
              <img
                src="/assets/sold.png"
                alt="Sell With Listo"
                className="h-[500px] w-full object-cover"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* REASONS */}
        <section className="pb-24">
          <div className="mx-auto max-w-[1450px] px-4 lg:px-8">
            {/* HEADING */}
            <div className="mb-12">
              <h2 className="text-[42px] font-black tracking-[-0.05em] text-[#0B132B] lg:text-[54px]">
                3 Reasons To Sell With Listo
              </h2>

              <p className="mt-4 max-w-[700px] text-[17px] leading-8 text-neutral-600">
                Discover how Listo helps homeowners sell faster, smarter, and
                with maximum visibility.
              </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
              {reasons.map((reason, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-[30px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(0,0,0,0.16)] ${
                    reason.dark ? "bg-[#04122B]" : "bg-white"
                  }`}
                >
                  {/* IMAGE CARD */}
                  {reason.image ? (
                    <>
                      <img
                        src={reason.image}
                        alt={reason.title}
                        className="h-[500px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                      {/* CONTENT */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-3xl text-white backdrop-blur-md">
                          👥
                        </div>

                        <h3 className="max-w-[300px] text-[34px] font-black leading-tight tracking-[-0.04em] text-white">
                          {reason.title}
                        </h3>

                        <p className="mt-5 text-[15px] leading-7 text-white/80">
                          {reason.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full min-h-[500px] flex-col justify-between p-8">
                      {/* ICON */}
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-5xl text-white backdrop-blur-sm">
                        {reason.icon}
                      </div>

                      {/* CONTENT */}
                      <div>
                        <h3 className="max-w-[320px] text-[36px] font-black leading-tight tracking-[-0.05em] text-white">
                          {reason.title}
                        </h3>

                        <p className="mt-6 text-[15px] leading-7 text-white/75">
                          {reason.description}
                        </p>

                        {/* BUTTON */}
                        <button className="mt-8 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-[#F36B22] hover:bg-[#F36B22]">
                          Learn More →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
