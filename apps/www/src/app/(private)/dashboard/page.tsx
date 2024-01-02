import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Dashboard from "@/components/client/layout/dashboard";
import CreateAuction from "@/components/client/modals/create-auction";
import {
  Box,
  Container,
  Flex,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { auth } from "@fleabay/auth";

import Auctions from "../../../components/client/components/auctions";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "fleabay | Dashboard",
};

export default async function Page() {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <Dashboard>
      <Container size="90%" my="md">
        <Stack gap="xl">
          <Box hiddenFrom="xs">
            <CreateAuction style={{ width: "100%" }} />
          </Box>
          <Box>
            <Flex align="center" justify="space-between">
              <Title order={2}>My Auctions</Title>

              <Box visibleFrom="xs">
                <CreateAuction />
              </Box>
            </Flex>
            <Text size="sm" c="grayText" mb="md">
              You can manage your auctions below.
            </Text>
            <Group>
              <Suspense
                fallback={
                  <>
                    {[...Array(3).keys()].map((i) => (
                      <Skeleton key={i} maw={288} h={400} radius="md" />
                    ))}
                  </>
                }
              >
                <Auctions sellerId={session.user.sellerId} />
              </Suspense>
            </Group>
          </Box>

          <Box>
            <Title order={2}>Auctions</Title>
            <Text size="sm" c="grayText" mb="md">
              You can bid on other auctions below.
            </Text>
            <Group>
              <Suspense
                fallback={
                  <>
                    {[...Array(3).keys()].map((i) => (
                      <Skeleton key={i} maw={288} h={400} radius="md" />
                    ))}
                  </>
                }
              >
                <Auctions />
              </Suspense>
            </Group>
          </Box>
        </Stack>
      </Container>
    </Dashboard>
  );
}
