"use client";

import { useEffect, useState } from "react";
import { Button, NumberInput, Text } from "@mantine/core";
import type { Session } from "next-auth";

import { api } from "../../../trpc/client";

export const BidInput = ({
  session,
  currentPrice,
  auctionId,
  increment = "1",
  isHighestBidder = false,
  isOutBid = false,
}: {
  session: Session | null;
  currentPrice: number;
  auctionId: number;
  increment?: string;
  isHighestBidder?: boolean;
  isOutBid?: boolean;
}) => {
  const fixedValue = Number(currentPrice).toFixed(2);
  const [value, setValue] = useState(fixedValue);
  const context = api.useUtils();
  const bidMutation = api.auction.bid.useMutation({
    onSuccess: () => {
      void context.auction.get.invalidate();
    },
  });

  useEffect(() => {
    if (Number(currentPrice) > Number(value)) {
      setValue(fixedValue);
    }
  }, [currentPrice]);

  return (
    <>
      <NumberInput
        radius="sm"
        size="sm"
        width={20}
        placeholder="Place Bid"
        leftSection={<div>£</div>}
        defaultValue={value}
        value={value}
        step={Number(increment)}
        disabled={isHighestBidder || bidMutation.isPending}
        error={isOutBid ? "You have been outbid" : undefined}
        onChange={(value) => {
          if (value < currentPrice.toString()) {
            setValue(fixedValue);
          } else {
            setValue(Number(value).toFixed(2));
          }
        }}
        rightSectionWidth={80}
        rightSection={
          !isHighestBidder && (
            <Button
              loading={bidMutation.isPending}
              disabled={bidMutation.isPending}
              onClick={() => {
                if (!session?.user) return;
                void bidMutation.mutateAsync({
                  auctionId,
                  amount: value,
                });
              }}
              style={{ flex: 1 }}
              component="a"
              href={!session?.user ? "/sign-in" : undefined}
            >
              Bid
            </Button>
          )
        }
      />
      {isHighestBidder && (
        <Text fz="xs" c={"brown"} mt={2}>
          You are the highest bidder.
        </Text>
      )}
    </>
  );
};
