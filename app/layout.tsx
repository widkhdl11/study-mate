import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
// import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import localFont from "next/font/local";

const GeistSans = localFont({
  src: "../public/fonts/geist/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

// const _geist = Geist({ subsets: ["latin"] });
// const _geistMono = Geist_Mono({ subsets: ["latin"] });
// const geist = Geist({ 
//   subsets: ["latin"],
//   display: 'swap',
// });
// const geistMono = Geist_Mono({ 
//   subsets: ["latin"],
//   display: 'swap',
// });

export const metadata: Metadata = {
  title: "Study Mate - 함께 성장하는 스터디 문화",
  description:
    "스터디 모집 플랫폼 Study Mate에서 나에게 맞는 스터디를 찾고 함께 성장하세요.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}>
        <body className="antialiased font-sans">
          {children}
          <Toaster />
        </body>
      </html>
    </QueryClientProvider>
  );
}
