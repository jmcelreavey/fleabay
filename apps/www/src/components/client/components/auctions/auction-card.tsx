"use client";

import classes from "@/styles/Auction.module.css";
import { Badge, Card, Center, Group, Image, Text } from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";

import Countdown from "../countdown";
import { useAuctionStore } from "./auction-store";
import { BidInput } from "./bid-input";

const mockdata = [
  { label: "4 passengers", icon: IconUsers },
  { label: "100 km/h in 4 seconds", icon: IconGauge },
  { label: "Automatic gearbox", icon: IconManualGearbox },
  { label: "Electric", icon: IconGasStation },
];

export function AuctionCard({ id }: { id: number }) {
  const { getAuction } = useAuctionStore();
  const auction = getAuction(id);

  if (!auction) return null;

  const { images, endDate, name, description, isOwner, currentPrice } = auction;

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
          <BidInput auctionId={id} />
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
