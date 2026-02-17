import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Visit Mariemont — Official Visitor Bureau",
  description:
    "Your personalized guide to the Village of Mariemont, Ohio. Curated itineraries, local favorites, and the finest hospitality this side of the Little Miami.",
  keywords: ["Mariemont", "Cincinnati", "Ohio", "visit", "itinerary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${playfair.variable} antialiased bg-stone-50 text-stone-900`}
      >
        {children}
      </body>
    </html>
  );
}
