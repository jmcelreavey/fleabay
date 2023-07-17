"use client";

import { toggleTheme } from "@/actions";
import { CacheProvider } from "@emotion/react";
import {
  useEmotionCache,
  MantineProvider,
  ColorSchemeProvider,
  type ColorScheme,
  AppShell,
} from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { useParams, useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import HeaderContent from "@/components/client/components/header";
import { User } from "@eboto-mo/db/schema";
import Navbar from "@/components/client/components/navbar";

export default function RootLayoutClient({
  children,
  theme,
  user,
}: {
  children: React.ReactNode;
  theme: ColorScheme;
  user: User | null;
}) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(theme);
  const params = useParams();

  const cache = useEmotionCache();
  cache.compat = true;
  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));
  return (
    <SessionProvider>
      <CacheProvider value={cache}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={() => {
            toggleTheme();
            setColorScheme((c) => (c === "dark" ? "light" : "dark"));
          }}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              fontFamily: "Poppins, sans-serif",
              colorScheme,
              primaryColor: "green",
            }}
          >
            <AppShell
              padding={0}
              header={<HeaderContent user={user} />}
              navbar={params.slug ? <Navbar /> : null}
              styles={(theme) => ({
                main: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[8]
                      : theme.colors.gray[0],
                },
              })}
            >
              {children}
            </AppShell>
          </MantineProvider>
        </ColorSchemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
