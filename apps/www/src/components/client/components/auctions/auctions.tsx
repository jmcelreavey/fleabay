"use client";

import { useEffect } from "react";
import { api } from "@/trpc/client";
import { SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import Balancer from "react-wrap-balancer";

import { AuctionCard } from "./auction-card";
import { useAuctionStore } from "./auction-store";

export default function Auctions({ sellerId }: { sellerId?: string }) {
  const { setAuctions } = useAuctionStore();
  const getAuctionsQuery = api.auction.getAll.useQuery(
    {
      sellerId,
    },
    {
      refetchInterval: 1000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );

  useEffect(() => {
    if (getAuctionsQuery.data) {
      setAuctions(getAuctionsQuery.data);
    }
  }, [getAuctionsQuery.data]);

  const NoAuctionsMessage = () => {
    if (sellerId) {
      return "You have no auctions.";
    } else {
      return "There are no auctions at the moment. Please check back later.";
    }
  };

  return (
    <Stack mt={"sm"}>
      {getAuctionsQuery.isLoading ? (
        <Skeleton height={400} />
      ) : !getAuctionsQuery.data || getAuctionsQuery.data.length === 0 ? (
        <Text ta="center">
          <Balancer>
            <NoAuctionsMessage />
          </Balancer>
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="xl">
          {getAuctionsQuery.data.map((auction, i) => {
            return <AuctionCard id={auction.id} key={i} />;
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
