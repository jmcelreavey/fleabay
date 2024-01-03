"use client";

import classes from "@/styles/Auction.module.css";
import { Badge, Card, Center, Group, Image, Text } from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";
import type { Session } from "next-auth/types";

import type { AuctionImage } from "@fleabay/db";

import { BidInput } from "./bid-input";
import Countdown from "./countdown";

const mockdata = [
  { label: "4 passengers", icon: IconUsers },
  { label: "100 km/h in 4 seconds", icon: IconGauge },
  { label: "Automatic gearbox", icon: IconManualGearbox },
  { label: "Electric", icon: IconGasStation },
];

export function AuctionCard({
  session,
  id,
  currentPrice,
  endDate,
  name,
  description,
  images,
  isHighestBidder,
  isOwner,
  isOutbid,
  bidIncrement,
}: {
  session: Session | null;
  id: number;
  currentPrice: number;
  endDate: Date;
  name: string;
  description: string;
  images?: AuctionImage[];
  isHighestBidder: boolean;
  isOwner: boolean;
  isOutbid: boolean;
  bidIncrement: string;
}) {
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  const coverImage =
    images?.[0]?.imageUrl ?? "./images/auction-placeholder.jpg";

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Group m={"sm"} justify="center">
          <Badge variant="outline">
            <Countdown endTime={endDate} />
          </Badge>
          <Image
            style={{
              borderRadius: "10px",
            }}
            src={coverImage}
            alt={name}
          />
        </Group>
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{name}</Text>
          <Text fz="xs" c="dimmed">
            {description}
          </Text>
        </div>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          brief description
        </Text>

        <Group gap={8}>{features}</Group>
      </Card.Section>

      {!isOwner && (
        <Card.Section className={classes.section}>
          <BidInput
            session={session}
            auctionId={id}
            currentPrice={currentPrice}
            increment={bidIncrement}
            isHighestBidder={isHighestBidder}
            isOutBid={isOutbid}
          />
        </Card.Section>
      )}

      {isOwner && (
        <Card.Section className={classes.section}>
          <Text fz="sm" c="dimmed" className={classes.label}>
            current price
          </Text>

          <Text size="md" fw={500}>
            £{currentPrice.toFixed(2)}
          </Text>
        </Card.Section>
      )}
    </Card>
  );
}
