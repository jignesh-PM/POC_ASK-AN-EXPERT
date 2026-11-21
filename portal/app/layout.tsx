import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";
import { roboto } from "./lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Morgan Ask the Expert",
  description:
    "Technical support, product information and expert guidance from Morgan Advanced Materials.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={roboto.variable} data-scroll-behavior="smooth">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
