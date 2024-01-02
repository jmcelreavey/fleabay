"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store";
import classes from "@/styles/Header.module.css";
import { api } from "@/trpc/client";
import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Loader,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Skeleton,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartBar,
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconSun,
  IconUserCircle,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";

export default function Header({ userId }: { userId?: string }) {
  const session = api.auth.getSession.useQuery();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const { setColorScheme } = useMantineColorScheme();

  const [openedMenu, { toggle }] = useDisclosure(false);

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const store = useStore();

  return (
    <Container h="100%" size={"90%"}>
      <Flex h="100%" align="center" justify="space-between" gap="xs">
        <Flex h="100%" align="center" gap="xs">
          <UnstyledButton component={Link} href={userId ? "/dashboard" : "/"}>
            <Flex gap="xs" align="center">
              <Image
                src="/images/logo.svg"
                alt="FleaBay Logo"
                width={32}
                height={32}
                priority
              />
              <Text fw={600} visibleFrom="xs">
                FleaBay
              </Text>
            </Flex>
          </UnstyledButton>

          <Center h="100%" hiddenFrom="xs">
            <Burger
              opened={store.dashboardMenu}
              onClick={() => store.toggleDashboardMenu()}
              size="sm"
              color="gray.6"
              py="xl"
              h="100%"
            />
          </Center>
        </Flex>

        {userId ? (
          <Flex
            align="center"
            gap={{
              base: "sm",
              xs: "lg",
            }}
          >
            <Menu
              position="bottom-end"
              opened={openedMenu}
              onChange={toggle}
              withinPortal
              width={200}
            >
              <MenuTarget>
                <UnstyledButton h="100%">
                  <Flex gap="xs" align="center">
                    <Box
                      style={{
                        position: "relative",
                        borderRadius: "50%",
                        overflow: "hidden",
                        width: 24,
                        height: 24,
                      }}
                    >
                      {!session.isPending ? (
                        session.data?.user.image ? (
                          <Image
                            src={session.data.user.image}
                            alt="Profile picture"
                            fill
                            sizes="100%"
                            priority
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <IconUserCircle />
                        )
                      ) : (
                        <Skeleton w={24} h={24} />
                      )}
                    </Box>

                    <Box w={{ base: 100, sm: 140 }}>
                      {session.data ? (
                        <>
                          <Text size="xs" truncate fw="bold">
                            {session.data.user.name}
                          </Text>
                          <Text size="xs" truncate>
                            {session.data.user.email}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Skeleton h={12} my={4} />
                          <Skeleton h={12} my={4} />
                        </>
                      )}
                    </Box>

                    <IconChevronDown
                      size={16}
                      style={{
                        rotate: openedMenu ? "-180deg" : "0deg",
                        transition: "all 0.25s",
                      }}
                    />
                  </Flex>
                </UnstyledButton>
              </MenuTarget>

              <MenuDropdown>
                <MenuItem
                  component={Link}
                  href="/dashboard"
                  // onClick={() => router.push("/dashboard")}
                  leftSection={<IconChartBar size={16} />}
                >
                  Dashboard
                </MenuItem>

                <MenuItem
                  component={Link}
                  href="/account"
                  leftSection={<IconUserCircle size={16} />}
                >
                  Account settings
                </MenuItem>

                <MenuItem
                  leftSection={
                    computedColorScheme === "light" ? (
                      <IconMoon size={16} />
                    ) : (
                      <IconSun size={16} />
                    )
                  }
                  onClick={() =>
                    setColorScheme(
                      computedColorScheme === "light" ? "dark" : "light",
                    )
                  }
                  closeMenuOnClick={false}
                >
                  {computedColorScheme === "light" ? "Dark mode" : "Light mode"}
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    setLogoutLoading(true);
                    await signOut();
                  }}
                  closeMenuOnClick={false}
                  leftSection={
                    logoutLoading ? (
                      <Loader size={16} m={0} />
                    ) : (
                      <IconLogout
                        style={{
                          transform: "translateX(2px)",
                        }}
                        size={16}
                      />
                    )
                  }
                  disabled={logoutLoading}
                >
                  Log out
                </MenuItem>
              </MenuDropdown>
            </Menu>
          </Flex>
        ) : (
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size={36}
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light",
                )
              }
            >
              <IconSun size="1rem" className={classes.light} />
              <IconMoon size="1rem" className={classes.dark} />
            </ActionIcon>

            <Button hiddenFrom="sm" component={Link} href="/sign-in">
              Sign in
            </Button>
            <Button
              variant="outline"
              visibleFrom="sm"
              component={Link}
              href="/sign-in"
            >
              Sign in
            </Button>

            <Button visibleFrom="sm" component={Link} href="/register">
              Get Started
            </Button>
          </Group>
        )}
      </Flex>
    </Container>
  );
}
