import dynamic from "next/dynamic";
import { CinematicHero } from "@/sections/CinematicHero";
import { FeaturedCategories } from "@/sections/FeaturedCategories";

const NewArrivals = dynamic(() => import("@/sections/NewArrivals").then((mod) => mod.NewArrivals), {
  loading: () => <SectionSkeleton />
});
const EditorialBanner = dynamic(() => import("@/sections/EditorialBanner").then((mod) => mod.EditorialBanner), {
  loading: () => <SectionSkeleton />
});
const ShopByLook = dynamic(() => import("@/sections/ShopByLook").then((mod) => mod.ShopByLook), {
  loading: () => <SectionSkeleton />
});
const TrendingCollections = dynamic(() => import("@/sections/TrendingCollections").then((mod) => mod.TrendingCollections), {
  loading: () => <SectionSkeleton />
});
const FlashSale = dynamic(() => import("@/sections/FlashSale").then((mod) => mod.FlashSale), {
  loading: () => <SectionSkeleton />
});
const StyleQuiz = dynamic(() => import("@/sections/StyleQuiz").then((mod) => mod.StyleQuiz), {
  loading: () => <SectionSkeleton />
});
const Testimonials = dynamic(() => import("@/sections/Testimonials").then((mod) => mod.Testimonials), {
  loading: () => <SectionSkeleton />
});
const InstagramGallery = dynamic(() => import("@/sections/InstagramGallery").then((mod) => mod.InstagramGallery), {
  loading: () => <SectionSkeleton />
});
const Newsletter = dynamic(() => import("@/sections/Newsletter").then((mod) => mod.Newsletter), {
  loading: () => <SectionSkeleton />
});

function SectionSkeleton() {
  return <div className="section-padding bg-transparent" aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <>
      <CinematicHero />
      <FeaturedCategories />
      <NewArrivals />
      <EditorialBanner />
      <ShopByLook />
      <TrendingCollections />
      <FlashSale />
      <StyleQuiz />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
