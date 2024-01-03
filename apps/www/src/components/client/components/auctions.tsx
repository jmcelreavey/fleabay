"use client";

import { api } from "@/trpc/client";
import { SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import Balancer from "react-wrap-balancer";

import { AuctionCard } from "./auction-card";

export default function Auctions({ sellerId }: { sellerId?: string }) {
  const sessionQuery = api.auth.getSession.useQuery();
  const getAuctionsQuery = api.auction.get.useQuery(
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
            const { images, currentPrice, endDate, name, description } =
              auction;
            return (
              <AuctionCard
                id={auction.id}
                session={sessionQuery?.data ?? null}
                isHighestBidder={auction.isHighestBidder}
                isOwner={auction.isOwner}
                isOutbid={auction.isOutbid}
                bidIncrement={auction.bidIncrement.toString()}
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
