import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthSessionSync } from "@/components/auth/AuthSessionSync";
import { AppChrome } from "@/components/layout/AppChrome";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { siteConfig } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthSessionSync />
          <SmoothScrollProvider>
            <AppChrome>{children}</AppChrome>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
