import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { LoadingProvider } from "./LoadingContext"
const avenir = localFont({
  src: [
    {
      path: './fonts/Avenir-Next-LT-PRO/AvenirNextLTPro-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Avenir-Next-LT-PRO/AvenirNextLTPro-MediumCn.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Avenir-Next-LT-PRO/AvenirNextLTPro-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
});

const hertical = localFont({
  src: './fonts/Hertical-Sans/Hertical-Sans.ttf',
  variable: '--font-heading',
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Global Classroom",
  description: "A Global Classroom creates interdisciplinary, justice-centered curriculum for high school Social Studies and Humanities classrooms and university-level courses.",
  keywords: [
    "global classroom",
    "social studies",
    "education",
    "curriculum",
    "human rights",
    "climate justice",
    "global politics",
    "learning"
  ],
  authors: [{ name: "Global Classroom", url: "https://globalclassroom.vercel.app" }],
  openGraph: {
    title: "Global Classroom",
    description: "Justice-centered curriculum and transformative learning for global citizenship.",
    url: "https://globalclassroom.vercel.app",
    siteName: "Global Classroom",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Global Classroom OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Classroom",
    description: "Justice-centered curriculum and transformative learning for global citizenship.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://globalclassroom.vercel.app"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avenir.variable} ${hertical.variable} antialiased`}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>

    </html>
  );
}
