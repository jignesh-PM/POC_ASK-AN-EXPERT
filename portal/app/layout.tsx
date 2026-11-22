import type { Metadata, Viewport } from "next";
import { roboto } from "./lib/fonts";
import { themeInitScript } from "./lib/theme-script";
import "./styles/tokens.css";
import "./styles/base.css";
import SiteChrome from "./components/shell/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Morgan Ask the Expert",
    template: "%s | Morgan Ask the Expert",
  },
  description: "Technical support, product information and expert guidance from Morgan Advanced Materials.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by the init script before hydration, hence suppressHydrationWarning.
    <html lang="en" className={roboto.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
