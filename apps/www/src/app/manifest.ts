import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FleaBay - Your One-Stop Online Auction Solution",
    short_name: "FleaBay",
    description:
      "Empower your auctions with FleaBay, the versatile and web-based livestock auction platform that offers secure online auctions for a variety of species.",
    start_url: "/",
    display: "standalone",
    lang: "en",
    icons: [
      {
        src: "/images/favicon/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
