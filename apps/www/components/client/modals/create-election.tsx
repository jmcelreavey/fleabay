"use client";

import { positionTemplate } from "@/constants";
import { api } from "@/trpc/client";
import type { MantineStyleProp } from "@mantine/core";
import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendar,
  IconLetterCase,
  IconPlus,
  IconTemplate,
} from "@tabler/icons-react";
import { useEffect } from "react";

export default function CreateElection({
  style,
}: {
  style?: MantineStyleProp;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<{
    name: string;
    slug: string;
    start_date: Date | null;
    end_date: Date | null;
    template: string;
  }>({
    initialValues: {
      name: "",
      slug: "",
      start_date: null,
      end_date: null,
      template: "none",
    },
    validateInputOnBlur: true,

    validate: {
      name: hasLength(
        { min: 3 },
        "Election name must be at least 3 characters",
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
      start_date: (value, values) => {
        if (!value) {
          return "Please enter an election start date";
        }
        if (values.end_date && value > values.end_date) {
          return "Start date must be before end date";
        }
      },
      end_date: (value, values) => {
        if (!value) {
          return "Please enter an election end date";
        }
        if (values.start_date && value < values.start_date) {
          return "End date must be after start date";
        }
      },
    },
  });

  useEffect(() => {
    if (opened) {
      form.reset();
    }
  }, [opened]);

  // const { mutate, isLoading, isError, error } =
  //   api.election.createElection.useMutation({
  //     onSuccess: () => {
  //       router.push(`/dashboard/${form.values.slug}`);
  //       close();
  //     },
  //   });

  return (
    <>
      <Button
        onClick={open}
        style={style}
        leftSection={<IconPlus size="1.25rem" />}
      >
        Create Election
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Create election"
        closeOnClickOutside={false}
      >
        <form
          onSubmit={form.onSubmit((value) => {
            const now = new Date();
            void (async () => {
              await api.election.createElection.mutate({
                ...value,
                name: value.name.trim(),
                slug: value.slug.trim(),
                start_date:
                  value.start_date ?? new Date(now.setDate(now.getDate() + 1)),
                end_date:
                  value.end_date ?? new Date(now.setDate(now.getDate() + 5)),
                template: value.template,
              });
            })();
          })}
        >
          <Stack gap="sm">
            <TextInput
              data-autofocus
              label="Election name"
              withAsterisk
              required
              placeholder="Enter election name"
              {...form.getInputProps("name")}
              leftSection={<IconLetterCase size="1rem" />}
              // disabled={isLoading}
            />

            <TextInput
              label="Election slug"
              description={
                <>
                  This will be used as the URL for your election
                  <br />
                  eboto-mo.com/{form.values.slug || "election-slug"}
                </>
              }
              // disabled={isLoading}
              withAsterisk
              required
              placeholder="Enter election slug"
              {...form.getInputProps("slug")}
              leftSection={<IconLetterCase size="1rem" />}
              // error={
              //   form.errors.slug ||
              //   (createElectionMutation.error?.data?.code === "CONFLICT" &&
              //     createElectionMutation.error?.message)
              // }
            />

            <DateTimePicker
              valueFormat="MMMM DD, YYYY (dddd) hh:mm A"
              label="Election start date"
              placeholder="Enter election start date"
              description="You can't change the election date once the election has started."
              required
              withAsterisk
              clearable
              popoverProps={{
                withinPortal: true,
                position: "bottom",
              }}
              minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
              firstDayOfWeek={0}
              {...form.getInputProps("start_date")}
              leftSection={<IconCalendar size="1rem" />}
              // disabled={isLoading}
            />
            <DateTimePicker
              valueFormat="MMMM DD, YYYY (dddd) hh:mm A"
              label="Election end date"
              placeholder="Enter election end date"
              description="You can't change the election date once the election has started."
              required
              withAsterisk
              clearable
              popoverProps={{
                withinPortal: true,
                position: "bottom",
              }}
              minDate={
                form.values.start_date ??
                new Date(new Date().setDate(new Date().getDate() + 1))
              }
              firstDayOfWeek={0}
              {...form.getInputProps("end_date")}
              leftSection={<IconCalendar size="1rem" />}
              // disabled={isLoading}
            />

            <Select
              label="Election template"
              description="Select a template for your election"
              withAsterisk
              required
              {...form.getInputProps("template")}
              data={positionTemplate
                .sort((a, b) => a.order - b.order)
                .map((template) => ({
                  group: template.name,

                  items: template.organizations.map((organization) => ({
                    value: organization.id,
                    label: organization.name,
                  })),
                }))}
              // nothingFound="No position template found"
              leftSection={<IconTemplate size="1rem" />}
              searchable
              // disabled={isLoading}
            />

            {/* {isError && (
              <Alert
                leftSection={<IconAlertCircle size="1rem" />}
                title="Error"
                color="red"
              >
                {error.message}
              </Alert>
            )} */}

            <Group justify="right" gap="xs">
              <Button
                variant="default"
                mr={2}
                onClick={close}
                // disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.isValid()}
                // loading={isLoading}
              >
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
