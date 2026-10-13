import TrendingGrid from "@/components/trending/TrendingGrid";

export const metadata = {
  title: "New For You — Property Feed | LISTO",
  description: "Explore the newest real estate listings added across Ontario.",
};

export default async function NewForYouPage({ searchParams }) {
  const sp = await searchParams;
  const page = Number(sp?.page || 1);

  return (
    <main className="min-h-screen bg-[#F4F4F4] mt-20">
      <TrendingGrid
        heading={"New For You"}
        crossLine={"Freshly listed homes and condos across Ontario, updated daily."}
        page={page}
        sort="ld"
        order="desc"
      />
    </main>
  );
}
