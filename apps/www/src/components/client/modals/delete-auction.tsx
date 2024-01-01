"use client";

import { useEffect } from "react";
import { api } from "@/trpc/client";
import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";

import type { Auction } from "@fleabay/db";

export default function DeleteAuction({ auction }: { auction: Auction }) {
  const context = api.useUtils();
  const [opened, { open, close }] = useDisclosure(false);
  const deleteAuctionMutation = api.auction.deleteSingle.useMutation({
    onSuccess: async () => {
      await context.auction.get.invalidate();
      notifications.show({
        title: `${auction.name} deleted!`,
        message: "Successfully deleted auction",
        icon: <IconCheck size="1.1rem" />,
        autoClose: 5000,
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
        autoClose: 3000,
      });
    },
  });

  useEffect(() => {
    if (opened) {
      deleteAuctionMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <>
      <Button
        onClick={open}
        variant="light"
        color="red"
        size="compact-sm"
        w="fit-content"
      >
        Delete
      </Button>
      <Modal
        opened={opened || deleteAuctionMutation.isPending}
        onClose={close}
        title={<Text fw={600}>Confirm Delete Auction - {auction.name}</Text>}
      >
        <Stack gap="sm">
          <Stack>
            <Text>Are you sure you want to delete this auction?</Text>
            <Text>This action cannot be undone.</Text>
          </Stack>
          {deleteAuctionMutation.isError && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="red"
              title="Error"
              variant="filled"
            >
              {deleteAuctionMutation.error.message}
            </Alert>
          )}
          <Group justify="right" gap="xs">
            <Button
              variant="default"
              onClick={close}
              disabled={deleteAuctionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              color="red"
              loading={deleteAuctionMutation.isPending}
              onClick={() =>
                deleteAuctionMutation.mutate({
                  id: auction.id,
                })
              }
              type="submit"
            >
              Confirm Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
