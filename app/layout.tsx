// app/layout.tsx
import type { Metadata } from "next";
import {
  Playfair_Display,
  Montserrat,
  Great_Vibes,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vwoke & Tevwe Wedding | #TeeVee2026 | March 2026",
  description:
    "Join us as we celebrate the union of Vwoke and Tevwe on March 1st, 2026 in Delta State, Nigeria",
  keywords: [
    "wedding",
    "Vwoke",
    "Tevwe",
    "TeeVee2026",
    "Delta State",
    "Nigeria",
    "wedding celebration",
  ],
  openGraph: {
    title: "Vwoke & Tevwe Wedding | #TeeVee2026",
    description: "Join us as we celebrate our special day - March 1st, 2026",
    type: "website",
    locale: "en_NG",
    siteName: "#TeeVee2026",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vwoke & Tevwe Wedding | #TeeVee2026",
    description: "Join us as we celebrate our special day - March 1st, 2026",
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${greatVibes.variable} ${cormorant.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
