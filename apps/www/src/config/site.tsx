import { IconDashboard, IconHome, IconUserCog } from "@tabler/icons-react";

export const siteConfig = {
  name: "FleaBay - Your One-Stop Online Auction Solution",
  description:
    "Empower your auctions with fleabay, the versatile and web-based auction platform that offers secure online auctions for a variety of livestock species.",
  url: "https://fleabay.northern.ie",
};

export type SiteConfig = typeof siteConfig;

export const SPOTLIGHT_DATA = [
  {
    id: "home",
    label: "Home",
    description: "Get to home page",
    link: "/",
    leftSection: <IconHome />,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "See your auctions that you have created",
    link: "/dashboard",
    leftSection: <IconDashboard />,
  },
  {
    id: "account",
    label: "Account Settings",
    description: "Change your account settings",
    leftSection: <IconUserCog />,
    link: "/account",
  },
];
