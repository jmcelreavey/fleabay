"use client";

import classes from "@/styles/Auction.module.css";
import { Badge, Card, Center, Group, Image, Text } from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";

import { Auction, AuctionImage } from "@fleabay/db/schema";

import { BidInput } from "./bid-input";
import Countdown from "./countdown";

const mockdata = [
  { label: "4 passengers", icon: IconUsers },
  { label: "100 km/h in 4 seconds", icon: IconGauge },
  { label: "Automatic gearbox", icon: IconManualGearbox },
  { label: "Electric", icon: IconGasStation },
];

export function AuctionCard({
  auction,
  images,
  hasHighestBid,
  hasBid,
}: {
  auction: Auction;
  images?: AuctionImage[];
  hasHighestBid?: boolean;
  hasBid?: boolean;
}) {
  const features = mockdata.map((feature) => (
    <Center key={feature.label}>
      <feature.icon size="1.05rem" className={classes.icon} stroke={1.5} />
      <Text size="xs">{feature.label}</Text>
    </Center>
  ));

  const coverImage =
    images?.[0]?.image?.url ?? "./images/auction-placeholder.jpg";

  return (
    <Card withBorder radius="md" className={classes.card + " highest-bid"}>
      <Card.Section className={classes.imageSection}>
        <Group justify="center">
          <Badge variant="outline">
            <Countdown endTime={auction.end_date} />
          </Badge>
          <Image
            style={{
              borderRadius: "10px",
            }}
            src={coverImage}
            alt={auction.name}
          />
        </Group>
      </Card.Section>

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{auction.name}</Text>
          <Text fz="xs" c="dimmed">
            {auction.description}
          </Text>
        </div>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          brief description
        </Text>

        <Group gap={8} mb={-8}>
          {features}
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <BidInput auction={auction} />
      </Card.Section>
    </Card>
  );
}
