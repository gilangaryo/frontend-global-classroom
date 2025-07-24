'use client'
// App Page (app/(site)/page.tsx)
import HeroSection from './components/landing-page/HeroSection';
import TransformativeSection from './components/landing-page/TransformativeSection';
import OfferSection from './components/landing-page/OfferSection';
import FeaturedResourcesSection from './components/landing-page/FeaturedResourcesSection';
import FreeLessonsSection from './components/landing-page/FreeLessonsSection';
import TestimonialSection from './components/landing-page/TestimonialSection';
// import ClientPdf from './components/ClientPdf';
// import PdfViewer from './components/PdfViewer';
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <>

      <HeroSection />
      <TransformativeSection />
      <OfferSection />
      <FeaturedResourcesSection />
      <FreeLessonsSection />
      <TestimonialSection />
      {/* <PdfViewer file="/pdf/test.pdf" /> */}
      <button
        className="p-4 bg-blue-600 text-white"
        onClick={() => router.push("/cart")}
      >
        TEST PUSH CART
      </button>
    </>
  );
}