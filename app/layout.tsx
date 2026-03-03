import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const atilla = localFont({
  src: "./fonts/AttilaSansSharp-Black.otf",
  variable: "--font-atilla",
  display: "swap",
});

const labil = localFont({
  src: "./fonts/LabilGrotesk-Black.otf",
  variable: "--font-labil",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bon Ajvar",
  description: "Natural. Pasteurized. Roasted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${atilla.variable} ${labil.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
