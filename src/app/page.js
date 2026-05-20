import AdvertisementBanner from "@/components/home/AdvertisementBanner";
import FeaturedListings from "@/components/home/FeaturedListings";
import HeroSection from "@/components/home/HeroSection";
import PopularCities from "@/components/home/PopularCities";
import PreConstruction from "@/components/home/Preconstruction";
import PropertyCards from "@/components/home/PropertyCards";
import PropertyReels from "@/components/home/PropertyReels";

const Home = () => {
  return (
    <>
      {/* <Navbar /> */}
      <HeroSection />
      <PropertyCards />
      <FeaturedListings />
      <PopularCities />
      <PreConstruction />
      <PropertyReels />
      <AdvertisementBanner />
    </>
  );
};

export default Home;
