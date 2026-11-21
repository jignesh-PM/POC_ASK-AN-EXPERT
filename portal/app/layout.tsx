import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  title: "Morgan Ask the Expert",
  description:
    "Technical support, product information and expert guidance from Morgan Advanced Materials.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
