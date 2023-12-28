"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ActionIcon,
  Anchor,
  Container,
  Group,
  Menu,
  MenuTarget,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <Container h="100%" fluid={true}>
      <Group justify="space-between" w="100%" gap={0} h="100%">
        <UnstyledButton component={Link} href="/">
          <Group gap={4}>
            <Image
              src="/images/logo.svg"
              alt="fleabay Logo"
              width={32}
              height={32}
              priority
            />
            <Text fw={600}>FleaBay</Text>
          </Group>
        </UnstyledButton>

        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            component={Link}
            href="https://www.facebook.com/"
            target="_blank"
            size="lg"
          >
            <IconBrandFacebook size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            component={Link}
            href="https://twitter.com/"
            target="_blank"
            size="lg"
            visibleFrom="xs"
          >
            <IconBrandTwitter size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            component={Link}
            href="https://www.youtube.com/"
            target="_blank"
            size="lg"
          >
            <IconBrandYoutube size="1.05rem" stroke={1.5} />
          </ActionIcon>

          <Anchor size="sm" component={Link} href="/contact" visibleFrom="xs">
            Contact Us
          </Anchor>

          <Menu shadow="md" width={200}>
            <MenuTarget>
              <Anchor size="sm">Legal</Anchor>
            </MenuTarget>
            <Menu.Dropdown>
              <Menu.Item component={Link} href="/privacy">
                Privacy Policy
              </Menu.Item>
              <Menu.Item component={Link} href="/terms">
                Terms & Conditions
              </Menu.Item>
              <Menu.Item component={Link} href="/cookie">
                Cookie Policy
              </Menu.Item>
              <Menu.Item component={Link} href="/disclaimer">
                Disclaimer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Container>
  );
}
