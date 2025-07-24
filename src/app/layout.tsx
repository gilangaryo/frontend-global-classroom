import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const avenir = localFont({
  src: [
    {
      path: './fonts/Avenir-Next-LT-PRO/AvenirNextLTPro-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Avenir-Next-LT-PRO/AvenirNextLTPro-Mediumcn.otf',
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
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${avenir.variable} ${hertical.variable} antialiased`}>

        {children}
      </body>

    </html>
  );
}
