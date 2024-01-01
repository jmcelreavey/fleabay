import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "mantine-react-table/styles.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { getBaseUrl } from "@/trpc/shared";
import TRPCProvider from "@/trpc/TRPCProvider";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
  keywords: ["fleabay", "Auction", "Livestock", "Livestock Auction System"],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/images/favicon/favicon.ico",
    shortcut: "/images/favicon/favicon-16x16.png",
    apple: "/images/favicon/apple-touch-icon.png",
  },
  manifest: `${getBaseUrl()}/site.webmanifest`,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8443325162715161"
          crossOrigin="anonymous"
        ></script>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={font.className}>
        <MantineProvider
          theme={{
            primaryColor: "brown",
            fontFamily: font.style.fontFamily,
            defaultGradient: {
              from: "#faf4f0",
              to: "#824f2b",
              deg: 5,
            },
            colors: {
              brown: [
                "#faf4f0",
                "#efe6e0",
                "#e0cabb",
                "#d2ad93",
                "#c79471",
                "#bf845b",
                "#bd7c4f",
                "#a66a40",
                "#945d36",
                "#824f2b",
              ],
              dark: [
                "#C1C2C5",
                "#A6A7AB",
                "#909296",
                "#5c5f66",
                "#373A40",
                "#2C2E33",
                "#25262b",
                "#1A1B1E",
                "#141517",
                "#101113",
              ],
              // Old dark mode. Changed in mantine@7.3.0
            },
          }}
        >
          <SessionProvider>
            <TRPCProvider>
              <Notifications />
              <Providers>{children}</Providers>
            </TRPCProvider>
          </SessionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
