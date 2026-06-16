import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";
import localFont from "next/font/local";
import MouseSpark from "@/components/MouseSpark";

export const metadata: Metadata = {
  title: "Paulina's Cool Page",
  description: "Pau's page",
};

const undefinedFont = localFont({
  src: "../public/fonts/undefined-medium.woff2",
  variable: "--font-undefined",
  weight: "500",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${undefinedFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <MouseSpark />
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
