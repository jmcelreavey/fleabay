"use client";

import QRCodeModal from "@/components/client/modals/qr-code";
import type { Election } from "@fleabay/db/schema";
import { ActionIcon, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconQrcode } from "@tabler/icons-react";

export default function DashboardShowQRCode({
  election,
}: {
  election: Election;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <ActionIcon
        onClick={open}
        variant="outline"
        color="#2f9e44"
        size="lg"
        hiddenFrom="md"
      >
        <IconQrcode />
      </ActionIcon>
      <Button onClick={open} visibleFrom="md" leftSection={<IconQrcode />}>
        Download/Scan QR Code
      </Button>

      <QRCodeModal election={election} close={close} opened={opened} />
    </>
  );
}
