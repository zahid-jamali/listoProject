import ListingDetailPage from "@/components/listing/ListingDetailPage";

// Backwards-compatible route. New links use the legacy SEO paths
// (/house-for-sale/..., /condo-for-sale/..., etc.) which render the same view.
export default function Page() {
  return <ListingDetailPage />;
}
