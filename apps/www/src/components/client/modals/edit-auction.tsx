"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/trpc/client";
import { transformUploadImage } from "@/utils";
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  rem,
  SimpleGrid,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, DropzoneReject, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconCurrencyPound,
  IconExternalLink,
  IconLetterCase,
  IconPhoto,
  IconUserSearch,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import type { Auction, AuctionImage } from "@fleabay/db";

export default function EditAuction({
  auction,
  images: _images,
}: {
  auction: Auction;
  images: AuctionImage[];
}) {
  const context = api.useUtils();
  const [opened, { open, close }] = useDisclosure(false);
  const openRef = useRef<() => void>(null);

  const initialValues = {
    startingPrice: auction.startingPrice.toString(),
    name: auction.name,
    description: auction.description,
    date: [auction.startDate, auction.endDate] as [Date, Date],
    images: null,
  };

  const editAuctionMutation = api.auction.editSingle.useMutation({
    onSuccess: async () => {
      await context.auction.get.invalidate();
      notifications.show({
        title: `${form.values.name} created!`,
        message: `Successfully updated auction: ${form.values.name}`,
        icon: <IconCheck size="1.1rem" />,
        autoClose: 5000,
      });
      close();
    },
  });

  const form = useForm<{
    startingPrice: string;
    name: string;
    description: string;
    date: [Date, Date];
    images: FileWithPath[] | null;
  }>({
    initialValues,
    validate: {
      startingPrice: (value) => {
        if (Number(value) < 0) {
          return "Starting price must be greater than 0";
        }
      },
      name: hasLength({ min: 1 }, "Name must be at least 1 characters"),
      description: hasLength(
        { min: 1 },
        "Description must be at least 1 characters",
      ),
      date: (value) => {
        const [startDate, endDate] = value;

        if (!startDate || !endDate) {
          return "Start date and end date are required";
        }

        if (dayjs(startDate).isAfter(endDate)) {
          return "Start date must be before end date";
        }

        if (dayjs(startDate).isBefore(dayjs())) {
          return "Start date must be after today";
        }

        if (dayjs(startDate).isSame(endDate)) {
          return "Start date and end date cannot be the same";
        }

        if (dayjs(startDate).isAfter(endDate)) {
          return "Start date must be before end date";
        }
      },
    },
  });

  useEffect(() => {
    if (opened) {
      form.setValues(initialValues);
      form.resetDirty(initialValues);
      editAuctionMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <>
      <Button onClick={open} variant="light" size="compact-sm" w="fit-content">
        Edit
      </Button>
      <Modal
        opened={opened || editAuctionMutation.isPending}
        onClose={close}
        title={
          <Text fw={600} lineClamp={1}>
            Edit Auction - {auction.name}
          </Text>
        }
        closeOnClickOutside={false}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            void (async () => {
              const images = values.images
                ? await Promise.all(
                    values.images.map((image) => transformUploadImage(image)),
                  )
                : null;

              const [startDate, endDate] = values.date;
              await editAuctionMutation.mutateAsync({
                id: auction.id,
                name: values.name,
                description: values.description,
                startingPrice: values.startingPrice,
                startDate,
                endDate,
                images,
              });
            })();
          })}
        >
          <Tabs radius="xs" defaultValue="basic-info">
            <TabsList grow>
              <SimpleGrid cols={2} w="100%" spacing={0} verticalSpacing={0}>
                <TabsTab
                  value="basic-info"
                  leftSection={<IconUserSearch size="0.8rem" />}
                  px="2rem"
                >
                  Basic Info
                </TabsTab>
                <TabsTab
                  value="images"
                  leftSection={<IconPhoto size="0.8rem" />}
                  px="2rem"
                >
                  Images
                </TabsTab>
              </SimpleGrid>
            </TabsList>

            <Stack gap="sm">
              <TabsPanel value="basic-info" pt="xs">
                <Stack gap="xs">
                  <TextInput
                    label="Name"
                    placeholder="Enter name"
                    required
                    withAsterisk
                    {...form.getInputProps("name")}
                    leftSection={<IconLetterCase size="1rem" />}
                    disabled={editAuctionMutation.isPending}
                  />

                  <TextInput
                    label="Description"
                    placeholder="Enter description"
                    {...form.getInputProps("description")}
                    leftSection={<IconLetterCase size="1rem" />}
                    disabled={editAuctionMutation.isPending}
                  />
                  <DatePickerInput
                    allowSingleDateInRange
                    type="range"
                    label="Auction start and end date"
                    description="You can't change the auction date once the auction has started."
                    leftSection={<IconCalendar size="1rem" />}
                    minDate={
                      new Date(new Date().setDate(new Date().getDate() + 1))
                    }
                    firstDayOfWeek={0}
                    required
                    disabled={editAuctionMutation.isPending}
                    {...form.getInputProps("date")}
                  />
                  <NumberInput
                    label="Starting price"
                    placeholder="Enter starting price"
                    required
                    withAsterisk
                    {...form.getInputProps("startingPrice")}
                    leftSection={<IconCurrencyPound size="1rem" />}
                    disabled={editAuctionMutation.isPending}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value).toFixed(2);
                      form.setFieldValue("startingPrice", value);
                    }}
                  />
                </Stack>
              </TabsPanel>

              <TabsPanel value="images" pt="xs">
                <Stack gap="xs">
                  <Dropzone
                    id="images"
                    onDrop={(files) => {
                      if (!files.length) return;
                      form.setFieldValue("images", files);
                    }}
                    openRef={openRef}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    multiple={true}
                    loading={editAuctionMutation.isPending}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      style={{ minHeight: rem(140), pointerEvents: "none" }}
                    >
                      {form.values.images && form.values.images.length > 0 ? (
                        form.values.images.map((image, index) => (
                          <Group justify="center" key={index}>
                            <Box
                              pos="relative"
                              style={() => ({
                                width: rem(120),
                                height: rem(120),
                              })}
                            >
                              <Image
                                src={
                                  typeof image === "string"
                                    ? image
                                    : URL.createObjectURL(image)
                                }
                                alt={`image-${index}`}
                                fill
                                sizes="100%"
                                priority
                                style={{ objectFit: "cover" }}
                              />
                            </Box>
                            <Text>{image.name}</Text>
                          </Group>
                        ))
                      ) : (
                        <Box>
                          <Text size="xl" inline ta="center">
                            Drag images here or click to select images
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7} ta="center">
                            Attach images to your account. Max file size is 5MB
                            each.
                          </Text>
                        </Box>
                      )}
                      <DropzoneReject>
                        <IconX size="3.2rem" stroke={1.5} />
                      </DropzoneReject>
                    </Group>
                  </Dropzone>
                  <Button
                    onClick={() => {
                      form.setFieldValue("images", []);
                    }}
                    disabled={
                      !form.values.images || editAuctionMutation.isPending
                    }
                  >
                    Delete images
                  </Button>
                </Stack>
              </TabsPanel>

              {editAuctionMutation.isError && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Error"
                  color="red"
                >
                  {editAuctionMutation.error.message}
                </Alert>
              )}

              <Group justify="space-between" gap={0}>
                <ActionIcon
                  size="lg"
                  variant="outline"
                  color="brown"
                  hiddenFrom="xs"
                >
                  <IconExternalLink size="1.25rem" />
                </ActionIcon>
                <Button
                  visibleFrom="xs"
                  leftSection={<IconExternalLink size="1.25rem" />}
                  variant="outline"
                  component={Link}
                  href={`/dashboard`}
                  target="_blank"
                >
                  Visit
                </Button>

                <Group justify="right" gap="xs">
                  <Button
                    variant="default"
                    onClick={close}
                    disabled={editAuctionMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!form.isDirty() || !form.isValid()}
                    loading={editAuctionMutation.isPending}
                  >
                    Update
                  </Button>
                </Group>
              </Group>
            </Stack>
          </Tabs>
        </form>
      </Modal>
    </>
  );
}
