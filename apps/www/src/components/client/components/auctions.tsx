"use client";

import { api } from "@/trpc/client";
import { Box, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import Balancer from "react-wrap-balancer";

import { AuctionCard } from "./auction-card";

export default function Auctions() {
  const getAuctionsQuery = api.auction.getAuctions.useQuery();
  return (
    <Stack>
      <Box>
        <Title order={2} ta="center">
          Current Auctions
        </Title>
      </Box>

      {getAuctionsQuery.isLoading ? (
        <Skeleton height={400} />
      ) : !getAuctionsQuery.data || getAuctionsQuery.data.length === 0 ? (
        <Text ta="center">
          <Balancer>
            There are no auctions at the moment. Please check back later.
          </Balancer>
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="xl">
          {getAuctionsQuery.data.map((auction, i) => {
            const { images, currentPrice, endDate, name, description } =
              auction;
            return (
              <AuctionCard
                images={images}
                key={i}
                currentPrice={Number(currentPrice)}
                endDate={endDate}
                name={name}
                description={description}
              />
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
