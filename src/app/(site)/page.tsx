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

export default function Home() {
  return (
    <main className="font-body">
      <HeroSection />
      <TransformativeSection />
      <OfferSection />
      <FeaturedResourcesSection />
      <FreeLessonsSection />
      <TestimonialSection />
      {/* <PdfViewer file="/pdf/test.pdf" /> */}
    </main>
  );
}