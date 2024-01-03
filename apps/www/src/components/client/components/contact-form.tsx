"use client";

import classes from "@/styles/Home.module.css";
import {
  Box,
  Button,
  Flex,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { IconAt, IconMapPin, IconPhone, IconSun } from "@tabler/icons-react";

export default function ContactForm() {
  const form = useForm<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      email: isEmail("Please specify a valid email"),
      message: hasLength(
        { min: 10 },
        "Message should be at least 10 characters long",
      ),
      subject: hasLength(
        { min: 4 },
        "Subject should be at least 4 characters long",
      ),
    },
  });
  return (
    <Paper radius="lg" withBorder p="sm">
      <Flex direction={{ base: "column", sm: "row" }}>
        <div className={classes.contacts}>
          <Text fz="lg" fw={700} className={classes["title-parent"]}>
            Contact information
          </Text>

          <Stack>
            {[
              {
                title: "Email",
                description: "hi@fleabay.northern.ie",
                icon: IconAt,
              },
              {
                title: "Phone",
                description: "+44 123 456 7890",
                icon: IconPhone,
              },
              {
                title: "Address",
                description: "Lurgan, Northern Ireland",
                icon: IconMapPin,
              },
              {
                title: "Working hours",
                description: "8AM - 5PM (GMT)",
                icon: IconSun,
              },
            ].map((item, index) => (
              <div key={index} className={classes.wrapper}>
                <Box mr="md">
                  <item.icon />
                </Box>

                <div>
                  <Text size="xs" className={classes["title-contact"]}>
                    {item.title}
                  </Text>
                  <Text className={classes.description}>
                    {item.description}
                  </Text>
                </div>
              </div>
            ))}
          </Stack>
        </div>

        <form
          className={classes.form}
          onSubmit={form.onSubmit((values) => console.log(values))}
        >
          <Text fz="lg" fw={700} className={classes["title-parent"]}>
            Get in touch
          </Text>

          <div className={classes.fields}>
            <Flex gap="md" direction={{ base: "column", sm: "row" }}>
              <TextInput
                label="Name"
                placeholder="Your name"
                disabled={false}
                w="100%"
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Email Address"
                placeholder="brice@bricesuazo.com"
                w="100%"
                disabled={false}
                required
                {...form.getInputProps("email")}
              />
            </Flex>

            <TextInput
              mt="md"
              label="Subject"
              placeholder="Subject"
              disabled={false}
              required
              {...form.getInputProps("subject")}
            />

            <Textarea
              required
              mt="md"
              label="Your message"
              placeholder="Please include all relevant information"
              autosize
              minRows={2}
              maxRows={5}
              disabled={false}
              {...form.getInputProps("message")}
            />

            <Group justify="flex-end" mt="md">
              <Button
                type="submit"
                w={{ base: "100%", sm: "fit-content" }}
                loading={false}
              >
                Send message
              </Button>
            </Group>
          </div>
        </form>
      </Flex>
    </Paper>
  );
}
