"use client";

import { useRouter } from "next/navigation";
import { SPOTLIGHT_DATA } from "@/config/site";
import { rem } from "@mantine/core";
import { Spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <>
      <Spotlight
        shortcut={["mod + K", "mod + P", "/"]}
        actions={[
          {
            group: "Pages",
            actions: SPOTLIGHT_DATA.map((action) => ({
              ...action,
              onClick: () => router.push(action.link),
            })),
          },
        ]}
        nothingFound="Nothing found..."
        highlightQuery
        scrollable
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Search...",
        }}
      />
      {children}
    </>
  );
}
