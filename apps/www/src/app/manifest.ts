import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FleaBay - Your One-Stop Online Voting Solution",
    short_name: "FleaBay",
    description:
      "Empower your elections with FleaBay, the versatile and web-based voting platform that offers secure online elections for any type of organization.",
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
