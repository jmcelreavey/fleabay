import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <Box backgroundColor="gray.800" color="white">
      <Container maxW="8xl" paddingY={8}>
        <Link href="/" style={{ width: "fit-content" }}>
          <HStack justifyContent={["center", "flex-start"]}>
            <Box position="relative" width={8} height={8}>
              <Image
                src="/assets/images/eboto-mo-logo.png"
                alt="eBoto Mo Logo"
                fill
                sizes="contain"
                style={{
                  filter: "invert(1)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </Box>
            <Text fontWeight="bold" color="white" fontSize={["2xl", "xl"]}>
              eBoto Mo
            </Text>
          </HStack>
        </Link>
        <Flex
          justifyContent="space-between"
          marginTop={4}
          flexDirection={["column", "row"]}
          textAlign={["center", "left"]}
          gap={4}
        >
          <Stack spacing={4} alignItems={["center", "flex-start"]}>
            <Text maxW="32rem">
              An Online Voting System for Cavite State University - Don Severino
              Delas Alas Campus with Real-time Voting Count.
            </Text>
            <Flex flexDirection="column" alignItems={["center", "flex-start"]}>
              <HStack>
                <Icon as={PhoneIcon} />
                <Text>+63 961 719 6607</Text>
              </HStack>
              <HStack>
                <Icon as={EnvelopeIcon} />
                <Link href="mailto:contact@eboto-mo.com">
                  contact@eboto-mo.com
                </Link>
              </HStack>
            </Flex>
          </Stack>
          <Box textAlign={["center", "end"]}>
            <Text fontWeight="bold">Created by:</Text>
            {[
              {
                id: 0,
                name: "Brice Brine Suazo",
                email: "bricebrine.suazo@cvsu.edu.ph",
              },
              {
                id: 1,
                name: "Rey Anthony De Luna",
                email: "reyanthony.deluna@cvsu.edu.ph",
              },
              {
                id: 2,
                name: "Lourielene Baldomero",
                email: "lourielene.baldomero@cvsu.edu.ph",
              },
            ].map((creator) => (
              <Link key={creator.id} href={`mailto:${creator.email}`}>
                <Text fontSize="sm" color="gray.200">
                  {creator.name}
                </Text>
              </Link>
            ))}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
