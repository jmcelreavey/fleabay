"use client";

import { useEffect } from "react";
import { api } from "@/trpc/client";
import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCheck,
  IconLetterCase,
} from "@tabler/icons-react";

import type { Partylist } from "@eboto-mo/db/schema";

export default function EditPartylist({ partylist }: { partylist: Partylist }) {
  const [opened, { open, close }] = useDisclosure(false);
  const context = api.useContext();
  const initialValues = {
    id: partylist.id,
    election_id: partylist.election_id,
    name: partylist.name,
    oldAcronym: partylist.acronym,
    newAcronym: partylist.acronym,
    description: partylist.description,
    logo_link: partylist.logo_link,
  };
  const form = useForm({
    initialValues,
    validateInputOnBlur: true,

    validate: {
      name: hasLength(
        {
          min: 3,
          max: 50,
        },
        "Name must be between 3 and 50 characters",
      ),
      newAcronym: hasLength(
        {
          min: 1,
          max: 24,
        },
        "Acronym must be between 1 and 24 characters",
      ),
    },
  });

  const editPartylistMutation = api.partylist.edit.useMutation({
    onSuccess: async () => {
      notifications.show({
        title: `${form.values.name} (${form.values.newAcronym}) updated.`,
        icon: <IconCheck size="1.1rem" />,
        message: "Your changes have been saved.",
        autoClose: 3000,
      });
      close();

      form.resetDirty(form.values);
      await context.partylist.getDashboardData.invalidate();
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
      form.setValues(initialValues);
      form.resetDirty(initialValues);
      editPartylistMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <>
      <Button onClick={open} size="compact-sm" variant="subtle">
        Edit
      </Button>
      <Modal
        opened={
          opened
          // || editPartylistMutation.isLoading
        }
        onClose={close}
        title={
          <Text fw={600}>
            Edit Partylist - {partylist.name} ({partylist.acronym})
          </Text>
        }
      >
        <form
          onSubmit={form.onSubmit((value) => {
            editPartylistMutation.mutate({
              id: partylist.id,
              name: value.name,
              oldAcronym: partylist.acronym,
              newAcronym: value.newAcronym,
              election_id: partylist.election_id,
              description: value.description,
              logo_link: value.logo_link,
            });
          })}
        >
          <Stack gap="sm">
            <TextInput
              placeholder="Enter partylist name"
              label="Name"
              required
              withAsterisk
              disabled={editPartylistMutation.isLoading}
              {...form.getInputProps("name")}
              leftSection={<IconLetterCase size="1rem" />}
            />

            <TextInput
              placeholder="Enter acronym"
              label="Acronym"
              required
              withAsterisk
              disabled={editPartylistMutation.isLoading}
              {...form.getInputProps("newAcronym")}
              leftSection={<IconLetterCase size="1rem" />}
            />

            {editPartylistMutation.isError && (
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                color="red"
                title="Error"
                variant="filled"
              >
                {editPartylistMutation.error.message}
              </Alert>
            )}

            <Group justify="right" gap="xs">
              <Button
                variant="default"
                onClick={close}
                disabled={editPartylistMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.isDirty()}
                loading={editPartylistMutation.isLoading}
              >
                Update
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
