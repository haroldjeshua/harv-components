import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono as FontMono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import AgentationWrapper from "@/components/agentation";
import { getAllEntries } from "@/lib/entries";
import "./globals.css";

const fontSans = localFont({
  src: [
    { path: "../public/fonts/Inter-4.1/InterVariable.woff2", weight: "100 900", style: "normal" },
    { path: "../public/fonts/Inter-4.1/InterVariable-Italic.woff2", weight: "100 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-sans",
});

const fontDisplay = localFont({
  src: [
    { path: "../public/fonts/Inter-4.1/InterDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Inter-4.1/InterDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Inter-4.1/InterDisplay-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Inter-4.1/InterDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-display",
});

const fontMono = FontMono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "harv components", template: "%s · harv components" },
  description: "A small personal archive of elements, components, and patterns I actually use.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const entries = getAllEntries();
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:px-3 focus:py-2"
            style={{ background: "var(--surface-2)" }}
          >
            Skip to content
          </a>
          <SiteHeader entries={entries} />
          <main id="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
        <AgentationWrapper />
      </body>
    </html>
  );
}
