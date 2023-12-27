"use client";

import { useConfetti } from "@/components/providers";
import { api } from "@/trpc/client";
import toWords from "@/utils/toWords";
import {
    Alert,
    Box,
    Button,
    Center,
    Checkbox,
    CheckboxGroup,
    Group,
    Modal,
    Radio,
    RadioGroup,
    Stack,
    Text,
    UnstyledButton,
    useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
    IconAlertCircle,
    IconCheck,
    IconFingerprint,
    IconUser,
    IconUserQuestion,
    IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import type {
    Candidate,
    Election,
    Partylist,
    Position,
} from "@fleabay/db/schema";

export default function VoteForm({
  positions,
  election,
}: {
  election: Election;
  positions: (Position & {
    candidates: (Candidate & {
      partylist: Partylist;
    })[];
  })[];
}) {
  const positionsQuery = api.election.getElectionVoting.useQuery(election.id, {
    initialData: positions,
  });
  const router = useRouter();
  const { fireConfetti } = useConfetti();
  const form = useForm<
    Record<
      string,
      {
        votes: string[];
        min: number;
        max: number;
        isValid: boolean;
      }
    >
  >({
    initialValues: Object.fromEntries(
      positionsQuery.data.map((position) => [
        position.id,
        {
          votes: [],
          min: position.min,
          max: position.max,
          isValid: false,
        },
      ]),
    ),
  });

  const [opened, { open, close }] = useDisclosure(false);

  const voteMutation = api.election.vote.useMutation({
    onSuccess: async () => {
      router.push(`/${election.slug}/realtime`);
      notifications.show({
        title: "Vote casted successfully!",
        message: "You can now view the realtime results",
        icon: <IconCheck size="1.1rem" />,
        autoClose: 5000,
      });
      await fireConfetti();
    },
    onError: () => {
      notifications.show({
        title: "Error casting vote",
        message: voteMutation.error?.message,
        icon: <IconX size="1.1rem" />,
        color: "red",
        autoClose: 5000,
      });
    },
  });

  return (
    <>
      <Modal
        opened={opened || voteMutation.isPending}
        onClose={close}
        title={<Text fw={600}>Confirm Vote</Text>}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            voteMutation.mutate({
              election_id: election.id,
              votes: Object.entries(values).map(([key, value]) => ({
                position_id: key,
                votes:
                  value.votes[0] === "abstain"
                    ? { isAbstain: true }
                    : {
                        isAbstain: false,
                        candidates: value.votes,
                      },
              })),
            });
          })}
        >
          <Stack>
            {positionsQuery.data.map((position) => {
              return (
                <Box key={position.id}>
                  <Text lineClamp={1}>{position.name}</Text>
                  <Text lineClamp={1} size="xs" c="dimmed">
                    {position.min === 0 && position.max === 1
                      ? `One selection only (1)`
                      : `${
                          position.min
                            ? `At least ${toWords
                                .convert(position.min)
                                .toLowerCase()} and a`
                            : " A"
                        }t most ${toWords
                          .convert(position.max)
                          .toLowerCase()} (${position.min} - ${position.max})`}
                  </Text>
                  {Object.entries(form.values)
                    .find(([key]) => key === position.id)?.[1]
                    .votes.map((candidateId) => {
                      const candidate = position.candidates.find(
                        (candidate) => candidate.id === candidateId,
                      );

                      return (
                        <Text
                          key={candidateId}
                          fw={600}
                          lineClamp={2}
                          c="gray.500"
                          size="lg"
                        >
                          {candidate
                            ? `${candidate.last_name}, ${candidate.first_name}${
                                candidate.middle_name
                                  ? " " + candidate.middle_name.charAt(0) + "."
                                  : ""
                              } (${candidate.partylist.acronym})`
                            : "Abstain"}
                        </Text>
                      );
                    })}
                </Box>
              );
            })}

            {voteMutation.isError && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Error"
                color="red"
              >
                {voteMutation.error.message}
              </Alert>
            )}
            <Group justify="right" gap="xs">
              <Button
                variant="default"
                onClick={close}
                disabled={voteMutation.isPending}
              >
                Cancel
              </Button>
              <Button loading={voteMutation.isPending} type="submit">
                Confirm
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <form>
        <Stack>
          {positionsQuery.data.map((position) => {
            return (
              <Box key={position.id}>
                <Text size="xl">{position.name}</Text>
                <Text size="sm" c="grayText">
                  {position.min === 0 && position.max === 1
                    ? "Select only one."
                    : `Select ${
                        position.min
                          ? `at least ${toWords
                              .convert(position.min)
                              .toLowerCase()} and `
                          : ""
                      }at most ${toWords
                        .convert(position.max)
                        .toLowerCase()}. (${
                        position.min ? `${position.min} - ` : ""
                      }${position.max})`}
                </Text>

                <Group>
                  {position.min === 0 && position.max === 1 ? (
                    <RadioGroup
                      onChange={(e) => {
                        form.setFieldValue(position.id, {
                          votes: [e],
                          min: position.min,
                          max: position.max,
                          isValid: true,
                        });
                      }}
                    >
                      <Group mt="xs">
                        {position.candidates.map((candidate) => (
                          <VoteCard
                            isSelected={
                              form.values[position.id]?.votes.includes(
                                candidate.id,
                              ) ?? false
                            }
                            candidate={candidate}
                            type="radio"
                            key={candidate.id}
                            value={candidate.id}
                          />
                        ))}
                        <VoteCard
                          type="radio"
                          isSelected={
                            form.values[position.id]?.votes.includes(
                              "abstain",
                            ) ?? false
                          }
                          value="abstain"
                        />
                      </Group>
                    </RadioGroup>
                  ) : (
                    <CheckboxGroup
                      onChange={(e) => {
                        const votes = e.includes("abstain")
                          ? form.values[position.id]?.votes.includes("abstain")
                            ? e.filter((e) => e !== "abstain")
                            : ["abstain"]
                          : e;

                        form.setFieldValue(position.id, {
                          votes,
                          min: position.min,
                          max: position.max,
                          isValid:
                            votes.length !== 0 &&
                            ((votes.includes("abstain") &&
                              votes.length === 1) ||
                              (votes.length >= position.min &&
                                votes.length <= position.max)),
                        });
                      }}
                      value={form.values[position.id]?.votes}
                    >
                      <Group mt="xs">
                        {position.candidates.map((candidate) => {
                          return (
                            <VoteCard
                              type="checkbox"
                              candidate={candidate}
                              isSelected={
                                form.values[position.id]?.votes.includes(
                                  candidate.id,
                                ) ?? false
                              }
                              value={candidate.id}
                              disabled={
                                (form.values[position.id]?.votes.length ?? 0) >=
                                  position.max &&
                                !form.values[position.id]?.votes.includes(
                                  candidate.id,
                                )
                              }
                              key={candidate.id}
                            />
                          );
                        })}
                        <VoteCard
                          type="checkbox"
                          isSelected={
                            form.values[position.id]?.votes.includes(
                              "abstain",
                            ) ?? false
                          }
                          value="abstain"
                        />
                      </Group>
                    </CheckboxGroup>
                  )}
                </Group>
              </Box>
            );
          })}
        </Stack>

        <Center
          style={{
            position: "sticky",
            bottom: 100,
            alignSelf: "center",
            marginTop: 12,
            marginBottom: 100,
          }}
        >
          <Button
            onClick={open}
            disabled={
              // voteMutation.isPending ??
              !Object.values(form.values).every((value) => value?.isValid)
            }
            leftSection={<IconFingerprint />}
            size="lg"
            radius="xl"
          >
            Cast Vote
          </Button>
        </Center>
      </form>
    </>
  );
}

function VoteCard({
  candidate,
  isSelected,
  value,
  disabled,
  type,
}: {
  type: "radio" | "checkbox";
  value: string;
  disabled?: boolean;
  candidate?: Candidate & {
    partylist: Partylist;
  };
  isSelected: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { colorScheme } = useMantineColorScheme();
  return (
    <>
      {type === "radio" && (
        <Radio
          value={value}
          ref={ref}
          style={{
            display: "none",
          }}
          disabled={disabled}
        />
      )}
      {type === "checkbox" && (
        <Checkbox
          ref={ref}
          value={value}
          style={{
            display: "none",
          }}
          disabled={disabled}
        />
      )}
      <UnstyledButton
        onClick={() => ref.current?.click()}
        disabled={disabled}
        w={{ base: "100%", sm: 140 }}
        h="auto"
        style={(theme) => ({
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          width: candidate ? 200 : 120,
          opacity: disabled ? 0.5 : 1,
          padding: theme.spacing.md,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: isSelected
            ? colorScheme === "light"
              ? theme.colors.brown[6]
              : theme.colors.brown[8]
            : colorScheme === "light"
              ? theme.colors.gray[3]
              : theme.colors.gray[7],
          backgroundColor: isSelected
            ? colorScheme === "light"
              ? theme.colors.gray[1]
              : theme.colors.dark[5]
            : "transparent",
          color: isSelected
            ? colorScheme === "light"
              ? theme.colors.brown[6]
              : theme.colors.brown[8]
            : theme.colors.gray[6],
          borderRadius: theme.radius.md,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          columnGap: theme.spacing.sm,
        })}
      >
        {candidate === undefined ? (
          <Box>
            <IconUserQuestion size={80} style={{ padding: 8 }} />
          </Box>
        ) : candidate.image ? (
          <Image
            src={candidate.image.url}
            alt=""
            width={80}
            height={80}
            style={{
              objectFit: "cover",
            }}
            priority
          />
        ) : (
          <Box>
            <IconUser size={80} style={{ padding: 8 }} />
          </Box>
        )}
        {candidate ? (
          <Text w="100%" ta={{ base: "left", sm: "center" }} lineClamp={1}>
            {candidate.last_name}, {candidate.first_name}
            {candidate.middle_name
              ? " " + candidate.middle_name.charAt(0) + "."
              : ""}{" "}
            ({candidate.partylist.acronym})
          </Text>
        ) : (
          <Text w="100%" ta="center" lineClamp={1}>
            Abstain
          </Text>
        )}
      </UnstyledButton>
    </>
  );
}
