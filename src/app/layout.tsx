import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContentShell from "@/components/ContentShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OE Hub",
  description: "Projects, reports, agents, and resources for the OE team.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ContentShell>{children}</ContentShell>
      </body>
    </html>
  );
}
