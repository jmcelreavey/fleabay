"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import classes from "@/styles/Candidate.module.css";
import { api } from "@/trpc/client";
import { transformUploadImage } from "@/utils";
import {
  Alert,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import type { DateValue } from "@mantine/dates";
import { YearPickerInput } from "@mantine/dates";
import type { FileWithPath } from "@mantine/dropzone";
import { Dropzone, DropzoneReject, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconFlag,
  IconInfoCircle,
  IconLetterCase,
  IconPhoto,
  IconPlus,
  IconUserPlus,
  IconUserSearch,
  IconX,
} from "@tabler/icons-react";

import type { Position } from "@fleabay/db/schema";

export default function CreateCandidate({ position }: { position: Position }) {
  const context = api.useUtils();
  const [opened, { open, close }] = useDisclosure(false);
  const partylistsQuery = api.partylist.getAllPartylistsByElectionId.useQuery({
    election_id: position.election_id,
  });
  const positionsQuery = api.position.getDashboardData.useQuery({
    election_id: position.election_id,
  });

  const params = useParams();
  const openRef = useRef<() => void>(null);

  const createCandidateMutation = api.candidate.createSingle.useMutation({
    onSuccess: async () => {
      await context.candidate.getDashboardData.invalidate();
      notifications.show({
        title: `${form.values.first_name} ${form.values.last_name} created!`,
        message: "Successfully created position",
        icon: <IconCheck size="1.1rem" />,
        autoClose: 5000,
      });
      close();
    },
    onError: (error) => {
      notifications.show({
        title: "Error creating candidate",
        message: error.message,
        icon: <IconAlertCircle size="1.1rem" />,
        color: "red",
        autoClose: 5000,
      });
    },
  });

  const form = useForm<{
    first_name: string;
    last_name: string;
    slug: string;
    partylist_id: string;
    middle_name: string;
    position_id: string;
    image: FileWithPath | null;

    platforms: {
      title: string;
      description: string | null;
    }[];

    achievements: {
      name: string;
      year: DateValue;
    }[];
    affiliations: {
      org_name: string;
      org_position: string;
      start_year: DateValue;
      end_year: DateValue;
    }[];
    eventsAttended: {
      name: string;
      year: DateValue;
    }[];
  }>({
    initialValues: {
      first_name: "",
      last_name: "",
      slug: "",
      partylist_id: partylistsQuery.data?.[0]?.id ?? "",
      middle_name: "",
      position_id: position.id,
      image: null,

      platforms: [],

      achievements: [],
      affiliations: [],
      eventsAttended: [],
    },
    validate: {
      first_name: hasLength(
        { min: 1 },
        "First name must be at least 1 characters",
      ),
      last_name: hasLength(
        { min: 1 },
        "Last name must be at least 1 characters",
      ),
      slug: (value) => {
        if (!value) {
          return "Please enter an election slug";
        }
        if (!/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(value)) {
          return "Election slug must be alphanumeric and can contain dashes";
        }
        if (value.length < 3 || value.length > 24) {
          return "Election slug must be between 3 and 24 characters";
        }
      },
      partylist_id: (value) => {
        if (!value) {
          return "Please select a partylist";
        }
      },
      position_id: (value) => {
        if (!value) {
          return "Please select a position";
        }
      },
    },
  });

  useEffect(() => {
    if (opened) {
      form.reset();
      createCandidateMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <>
      <UnstyledButton
        onClick={open}
        className={classes["create-candidate-button"]}
      >
        <IconUserPlus />

        <Box>
          <Text>Add</Text>
          <Text visibleFrom="sm"> candidate</Text>
        </Box>
      </UnstyledButton>

      <Modal
        opened={opened || createCandidateMutation.isPending}
        onClose={close}
        title={<Text fw={600}>Create candidate</Text>}
        closeOnClickOutside={false}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            void (async () => {
              await createCandidateMutation.mutateAsync({
                first_name: values.first_name,
                last_name: values.last_name,
                slug: values.slug,
                partylist_id: values.partylist_id,
                position_id: values.position_id,
                middle_name: values.middle_name,
                election_id: position.election_id,
                image: values.image
                  ? await transformUploadImage(values.image)
                  : null,

                platforms: values.platforms.map((p) => ({
                  title: p.title,
                  description: p.description,
                })),

                achievements: values.achievements.map((a) => ({
                  name: a.name,
                  year: new Date(a.year?.toDateString() ?? ""),
                })),
                affiliations: values.affiliations.map((a) => ({
                  org_name: a.org_name,
                  org_position: a.org_position,
                  start_year: new Date(a.start_year?.toDateString() ?? ""),
                  end_year: new Date(a.end_year?.toDateString() ?? ""),
                })),
                eventsAttended: values.eventsAttended.map((a) => ({
                  name: a.name,
                  year: new Date(a.year?.toDateString() ?? ""),
                })),
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
                >
                  Basic Info
                </TabsTab>
                <TabsTab
                  value="image"
                  leftSection={<IconPhoto size="0.8rem" />}
                >
                  Image
                </TabsTab>
                <TabsTab
                  value="platforms"
                  leftSection={<IconInfoCircle size="0.8rem" />}
                >
                  Platforms
                </TabsTab>
                <TabsTab
                  value="credentials"
                  leftSection={<IconInfoCircle size="0.8rem" />}
                >
                  Credentials
                </TabsTab>
              </SimpleGrid>
            </TabsList>
            <Stack gap="sm">
              <TabsPanel value="basic-info" pt="xs">
                <Stack gap="xs">
                  <TextInput
                    label="First name"
                    placeholder="Enter first name"
                    required
                    withAsterisk
                    {...form.getInputProps("first_name")}
                    leftSection={<IconLetterCase size="1rem" />}
                    disabled={createCandidateMutation.isPending}
                  />

                  <TextInput
                    label="Middle name"
                    placeholder="Enter middle name"
                    {...form.getInputProps("middle_name")}
                    leftSection={<IconLetterCase size="1rem" />}
                    disabled={createCandidateMutation.isPending}
                  />
                  <TextInput
                    label="Last name"
                    placeholder="Enter last name"
                    required
                    withAsterisk
                    {...form.getInputProps("last_name")}
                    leftSection={<IconLetterCase size="1rem" />}
                    disabled={createCandidateMutation.isPending}
                  />

                  <TextInput
                    label="Slug"
                    placeholder="Enter slug"
                    description={
                      <Text size="xs">
                        This will be used as the candidate&apos;s URL.
                        <br />
                        fleabay.northern.ie/
                        {params?.electionDashboardSlug?.toString()}/
                        {form.values.slug || "candidate-slug"}
                      </Text>
                    }
                    required
                    withAsterisk
                    {...form.getInputProps("slug")}
                    leftSection={<IconLetterCase size="1rem" />}
                    disabled={createCandidateMutation.isPending}
                  />

                  <Select
                    placeholder="Select partylist"
                    label="Partylist"
                    leftSection={<IconFlag size="1rem" />}
                    {...form.getInputProps("partylist_id")}
                    data={partylistsQuery.data?.map((partylist) => {
                      return {
                        label: partylist.name,
                        value: partylist.id,
                      };
                    })}
                    disabled={createCandidateMutation.isPending}
                  />

                  <Select
                    placeholder="Select position"
                    label="Position"
                    leftSection={<IconUserSearch size="1rem" />}
                    {...form.getInputProps("position_id")}
                    data={positionsQuery.data?.map((position) => {
                      return {
                        label: position.name,
                        value: position.id,
                      };
                    })}
                    disabled={createCandidateMutation.isPending}
                  />
                </Stack>
              </TabsPanel>
              <TabsPanel value="image" pt="xs">
                <Stack gap="xs">
                  <Dropzone
                    id="image"
                    onDrop={(files) => {
                      if (!files[0]) return;
                      form.setFieldValue("image", files[0]);
                    }}
                    openRef={openRef}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    multiple={false}
                    loading={createCandidateMutation.isPending}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      style={{ minHeight: rem(140), pointerEvents: "none" }}
                    >
                      {form.values.image ? (
                        <Group justify="center">
                          <Box
                            pos="relative"
                            style={() => ({
                              width: rem(120),
                              height: rem(120),
                            })}
                          >
                            <Image
                              src={
                                typeof form.values.image === "string"
                                  ? form.values.image
                                  : URL.createObjectURL(form.values.image)
                              }
                              alt="image"
                              fill
                              sizes="100%"
                              priority
                              style={{ objectFit: "cover" }}
                            />
                          </Box>
                          <Text>{form.values.image.name}</Text>
                        </Group>
                      ) : (
                        <Box>
                          <Text size="xl" inline ta="center">
                            Drag image here or click to select image
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7} ta="center">
                            Attach a image to your account. Max file size is
                            5MB.
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
                      form.setFieldValue("image", null);
                    }}
                    disabled={
                      !form.values.image || createCandidateMutation.isPending
                    }
                  >
                    Delete image
                  </Button>
                </Stack>
              </TabsPanel>
              <TabsPanel value="platforms" pt="xs">
                <Stack gap="xs">
                  {form.values.platforms.map((platform, index) => (
                    <Box key={index}>
                      <Stack gap="xs">
                        <TextInput
                          w="100%"
                          label="Title"
                          placeholder="Enter title"
                          required
                          value={platform.title}
                          disabled={createCandidateMutation.isPending}
                          onChange={(e) => {
                            form.setValues({
                              ...form.values,
                              platforms: form.values.platforms.map((p, i) => {
                                if (i === index) {
                                  return {
                                    ...p,
                                    title: e.target.value,
                                  };
                                }
                                return p;
                              }),
                            });
                          }}
                        />
                        <Textarea
                          w="100%"
                          label="Description"
                          placeholder="Enter description"
                          value={platform.description ?? ""}
                          disabled={createCandidateMutation.isPending}
                          onChange={(e) => {
                            form.setValues({
                              ...form.values,
                              platforms: form.values.platforms.map((p, i) => {
                                if (i === index) {
                                  return {
                                    ...p,
                                    description: e.target.value,
                                  };
                                }
                                return p;
                              }),
                            });
                          }}
                        />
                      </Stack>
                      <Button
                        variant="outline"
                        mt="xs"
                        size="xs"
                        w="100%"
                        color="red"
                        disabled={createCandidateMutation.isPending}
                        onClick={() => {
                          form.setValues({
                            ...form.values,

                            platforms: form.values.platforms.filter(
                              (_, i) => i !== index,
                            ),
                          });
                        }}
                      >
                        Delete platform
                      </Button>
                    </Box>
                  ))}
                  <Button
                    leftSection={<IconPlus size="1.25rem" />}
                    disabled={createCandidateMutation.isPending}
                    onClick={() => {
                      form.setValues({
                        ...form.values,

                        platforms: [
                          ...form.values.platforms,
                          {
                            title: "",
                            description: "",
                          },
                        ],
                      });
                    }}
                  >
                    Add platform
                  </Button>
                </Stack>
              </TabsPanel>
              <TabsPanel value="credentials" pt="xs">
                <Tabs variant="outline" radius="xs" defaultValue="achievements">
                  <TabsList grow>
                    <TabsTab value="achievements">
                      <Text size="xs" truncate>
                        Achievement
                      </Text>
                    </TabsTab>
                    <TabsTab value="affiliations">
                      <Text size="xs" truncate>
                        Affiliations
                      </Text>
                    </TabsTab>
                    <TabsTab value="events-attended">
                      <Text size="xs" truncate>
                        Seminars Attended
                      </Text>
                    </TabsTab>
                  </TabsList>
                  <TabsPanel value="achievements" pt="xs">
                    <Stack gap="md">
                      {form.values.achievements.map((achievement, index) => (
                        <Box key={index}>
                          <Flex align="end" gap="xs">
                            <TextInput
                              w="100%"
                              label="Achievement"
                              placeholder="Enter achievement"
                              required
                              value={achievement.name}
                              disabled={createCandidateMutation.isPending}
                              onChange={(e) => {
                                form.setValues({
                                  ...form.values,
                                  achievements: form.values.achievements.map(
                                    (achievement, i) =>
                                      i === index
                                        ? {
                                            ...achievement,
                                            name: e.target.value,
                                          }
                                        : achievement,
                                  ),
                                });
                              }}
                            />
                            <YearPickerInput
                              label="Year"
                              // TODO: remove comment when https://github.com/mantinedev/mantine/issues/5401 is fixed
                              // placeholder="Enter year"
                              popoverProps={{
                                withinPortal: true,
                              }}
                              disabled={createCandidateMutation.isPending}
                              value={achievement.year}
                              onChange={(date) => {
                                form.setValues({
                                  ...form.values,
                                  achievements: form.values.achievements.map(
                                    (achievement, i) =>
                                      i === index
                                        ? {
                                            ...achievement,
                                            year: date,
                                          }
                                        : achievement,
                                  ),
                                });
                              }}
                              required
                            />
                          </Flex>
                          <Button
                            variant="outline"
                            mt="xs"
                            size="xs"
                            w="100%"
                            color="red"
                            disabled={createCandidateMutation.isPending}
                            onClick={() => {
                              form.setValues({
                                ...form.values,

                                achievements: form.values.achievements.filter(
                                  (_, i) => i !== index,
                                ),
                              });
                            }}
                          >
                            Delete achievement
                          </Button>
                        </Box>
                      ))}

                      <Button
                        leftSection={<IconPlus size="1.25rem" />}
                        disabled={createCandidateMutation.isPending}
                        onClick={() => {
                          form.setValues({
                            ...form.values,

                            achievements: [
                              ...form.values.achievements,
                              {
                                name: "",
                                year: new Date(new Date().getFullYear(), 0),
                              },
                            ],
                          });
                        }}
                      >
                        Add achievement
                      </Button>
                    </Stack>
                  </TabsPanel>
                  <TabsPanel value="affiliations" pt="xs">
                    <Stack gap="md">
                      {form.values.affiliations.map((affiliation, index) => (
                        <Box key={index}>
                          <TextInput
                            w="100%"
                            label="Organization name"
                            placeholder="Enter organization name"
                            required
                            value={affiliation.org_name}
                            disabled={createCandidateMutation.isPending}
                            onChange={(e) => {
                              form.setValues({
                                ...form.values,
                                affiliations: form.values.affiliations.map(
                                  (affiliation, i) =>
                                    i === index
                                      ? {
                                          ...affiliation,
                                          org_name: e.target.value,
                                        }
                                      : affiliation,
                                ),
                              });
                            }}
                          />
                          <TextInput
                            w="100%"
                            label="Position"
                            placeholder="Enter your position in the organization"
                            required
                            value={affiliation.org_position}
                            disabled={createCandidateMutation.isPending}
                            onChange={(e) => {
                              form.setValues({
                                ...form.values,
                                affiliations: form.values.affiliations.map(
                                  (affiliation, i) =>
                                    i === index
                                      ? {
                                          ...affiliation,
                                          org_position: e.target.value,
                                        }
                                      : affiliation,
                                ),
                              });
                            }}
                          />

                          <Flex gap="xs">
                            <YearPickerInput
                              label="Start year"
                              // placeholder="Enter start year"
                              w="100%"
                              popoverProps={{
                                withinPortal: true,
                              }}
                              value={affiliation.start_year}
                              disabled={createCandidateMutation.isPending}
                              onChange={(date) => {
                                form.setValues({
                                  ...form.values,
                                  affiliations: form.values.affiliations.map(
                                    (affiliation, i) =>
                                      i === index
                                        ? {
                                            ...affiliation,
                                            start_year: date,
                                          }
                                        : affiliation,
                                  ),
                                });
                              }}
                              required
                            />
                            <YearPickerInput
                              label="End year"
                              // placeholder="Enter end year"
                              w="100%"
                              popoverProps={{
                                withinPortal: true,
                              }}
                              disabled={createCandidateMutation.isPending}
                              value={affiliation.end_year}
                              onChange={(date) => {
                                form.setValues({
                                  ...form.values,
                                  affiliations: form.values.affiliations.map(
                                    (affiliation, i) =>
                                      i === index
                                        ? {
                                            ...affiliation,
                                            end_year: date,
                                          }
                                        : affiliation,
                                  ),
                                });
                              }}
                              required
                            />
                          </Flex>
                          <Button
                            variant="outline"
                            mt="xs"
                            size="xs"
                            w="100%"
                            color="red"
                            disabled={createCandidateMutation.isPending}
                            onClick={() => {
                              form.setValues({
                                ...form.values,

                                affiliations: form.values.affiliations.filter(
                                  (_, i) => i !== index,
                                ),
                              });
                            }}
                          >
                            Delete affiliation
                          </Button>
                        </Box>
                      ))}

                      <Button
                        leftSection={<IconPlus size="1.25rem" />}
                        disabled={createCandidateMutation.isPending}
                        onClick={() => {
                          form.setValues({
                            ...form.values,

                            affiliations: [
                              ...form.values.affiliations,
                              {
                                org_name: "",
                                org_position: "",
                                start_year: new Date(
                                  new Date().getFullYear(),
                                  -1,
                                ),
                                end_year: new Date(new Date().getFullYear(), 0),
                              },
                            ],
                          });
                        }}
                      >
                        Add affiliation
                      </Button>
                    </Stack>
                  </TabsPanel>
                  <TabsPanel value="events-attended" pt="xs">
                    <Stack gap="md">
                      {form.values.eventsAttended.map(
                        (eventAttended, index) => (
                          <Box key={index}>
                            <Flex gap="xs" align="end">
                              <TextInput
                                w="100%"
                                label="Seminars attended"
                                placeholder="Enter seminars attended"
                                required
                                value={eventAttended.name}
                                disabled={createCandidateMutation.isPending}
                                onChange={(e) => {
                                  form.setValues({
                                    ...form.values,
                                    eventsAttended:
                                      form.values.eventsAttended.map(
                                        (achievement, i) =>
                                          i === index
                                            ? {
                                                ...achievement,
                                                name: e.target.value,
                                              }
                                            : achievement,
                                      ),
                                  });
                                }}
                              />
                              <YearPickerInput
                                label="Year"
                                // placeholder="Enter year"
                                popoverProps={{
                                  withinPortal: true,
                                }}
                                value={eventAttended.year}
                                disabled={createCandidateMutation.isPending}
                                onChange={(date) => {
                                  form.setValues({
                                    ...form.values,
                                    eventsAttended:
                                      form.values.eventsAttended.map(
                                        (achievement, i) =>
                                          i === index
                                            ? {
                                                ...achievement,
                                                year: date,
                                              }
                                            : achievement,
                                      ),
                                  });
                                }}
                                required
                              />
                            </Flex>
                            <Button
                              variant="outline"
                              mt="xs"
                              size="xs"
                              w="100%"
                              color="red"
                              disabled={createCandidateMutation.isPending}
                              onClick={() => {
                                form.setValues({
                                  ...form.values,

                                  eventsAttended:
                                    form.values.eventsAttended.filter(
                                      (_, i) => i !== index,
                                    ),
                                });
                              }}
                            >
                              Delete seminar attended
                            </Button>
                          </Box>
                        ),
                      )}

                      <Button
                        leftSection={<IconPlus size="1.25rem" />}
                        disabled={createCandidateMutation.isPending}
                        onClick={() => {
                          form.setValues({
                            ...form.values,

                            eventsAttended: [
                              ...form.values.eventsAttended,
                              {
                                name: "",
                                year: new Date(new Date().getFullYear(), 0),
                              },
                            ],
                          });
                        }}
                      >
                        Add seminar attended
                      </Button>
                    </Stack>
                  </TabsPanel>
                </Tabs>
              </TabsPanel>

              {createCandidateMutation.isError && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Error"
                  color="red"
                >
                  {createCandidateMutation.error.message}
                </Alert>
              )}

              <Group justify="right" gap="xs">
                <Button
                  variant="default"
                  onClick={close}
                  disabled={createCandidateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !form.isValid() || createCandidateMutation.isPending
                  }
                  loading={createCandidateMutation.isPending}
                >
                  Create
                </Button>
              </Group>
            </Stack>
          </Tabs>
        </form>
      </Modal>
    </>
  );
}
