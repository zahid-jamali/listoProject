import TrendingGrid from "@/components/trending/TrendingGrid";

export const metadata = {
  title: "Trending Properties | LISTO",
  description: "Discover trending real estate listings across Ontario",
};

export default function TrendingPage({ searchParams }) {
  const page = Number(searchParams?.page || 1);

  return (
    <main className="min-h-screen bg-[#F4F4F4] mt-20">
      <TrendingGrid
        heading={"Trending Properties"}
        crossLine={"Discover the most viewed and fastest moving listings."}
        page={page}
      />
    </main>
  );
}
