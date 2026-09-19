import type { Metadata, Viewport } from "next";

import {
  Geist,
  Geist_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";

import "./globals.css";

import Providers from "./components/home/providers";
import LayoutShell from "./components/layout-shell";
import { CuteScrollbar } from "@/components/ui/scrollbar-reveal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Broadroom",
  description:
    "Discover rooms, meet people, and start talking in real time.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <LayoutShell>
            <CuteScrollbar/>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}