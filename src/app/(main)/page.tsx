import FeaturedKitchens from "@/components/landing/FeaturedKitchens";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Newsletter from "@/components/landing/Newsletter";
import TopCategories from "@/components/landing/TopCategories";
import TrendingMeals from "@/components/landing/TrendingMeals";
import HowItWorks from "@/components/landing/HowItWorks";
import JoinNetwork from "@/components/landing/JoinNetwork";

export default function Home() {
  return (
   <div>
      <Header />
      <Hero />
      <TopCategories />
      <FeaturedKitchens />
      <TrendingMeals />
      <HowItWorks />
      <JoinNetwork />
      <Newsletter />
      <Footer />
   </div>
  );
}
