"use client";

import { useEffect } from "react";
import { Button, NumberInput, Text } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconCurrencyPound } from "@tabler/icons-react";
import type { Session } from "next-auth";
import { z } from "zod";

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
  const context = api.useUtils();
  const bidMutation = api.auction.bid.useMutation({
    onSuccess: () => {
      void context.auction.get.invalidate();
    },
  });

  const form = useForm<{
    bidAmount: string;
  }>({
    validateInputOnBlur: true,
    initialValues: {
      bidAmount: fixedValue,
    },
    validate: zodResolver(
      z.object({
        bidAmount: z
          .string()
          .refine(
            (value) => !isNaN(parseFloat(value)),
            "Starting price must be a valid number",
          )
          .refine(
            (value) => parseFloat(value) >= currentPrice,
            "You can't bid less than the current price",
          ),
      }),
    ),
  });

  useEffect(() => {
    if (Number(fixedValue) > Number(form.values.bidAmount)) {
      form.setFieldValue("bidAmount", fixedValue);
    }

    if (isOutBid) {
      form.setFieldError("bidAmount", "You have been outbid");
    }
  }, [fixedValue, isOutBid]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        void (async () => {
          await bidMutation.mutateAsync({
            auctionId,
            amount: values.bidAmount,
          });
        })();
      })}
    >
      <NumberInput
        radius="sm"
        size="sm"
        width={20}
        placeholder="Place Bid"
        required
        {...form.getInputProps("bidAmount")}
        leftSection={<IconCurrencyPound size="1rem" />}
        min={Number(currentPrice)}
        step={Number(increment)}
        disabled={isHighestBidder || bidMutation.isPending}
        onChange={(e) => {
          const value = parseFloat(e.toString()).toFixed(2);
          form.setFieldValue("bidAmount", value);
        }}
        rightSectionWidth={80}
        rightSection={
          !isHighestBidder && (
            <Button
              loading={bidMutation.isPending}
              disabled={bidMutation.isPending}
              style={{ flex: 1 }}
              {...(!session?.user
                ? { component: "a", href: "/sign-in" }
                : { type: "submit" })}
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
    </form>
  );
};
