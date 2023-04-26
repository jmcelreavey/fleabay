import {
  Button,
  Text,
  Table,
  TextInput,
  Flex,
  Box,
  Stack,
  Center,
  Loader,
  Modal,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconMailForward,
  IconSearch,
  IconUpload,
  IconUserPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import CreateVoterModal from "../../../components/modals/CreateVoter";
import Voter from "../../../components/Voter";
import { api } from "../../../utils/api";
import Balancer from "react-wrap-balancer";
import UploadBulkVoter from "../../../components/modals/UploadBulkVoter";
import { useEffect, useState } from "react";
import Head from "next/head";
import { notifications } from "@mantine/notifications";

const DashboardVoter = () => {
  const context = api.useContext();
  const router = useRouter();
  const [
    openedInviteVoters,
    { open: openInviteVoters, close: closeInviteVoters },
  ] = useDisclosure(false);
  const [
    openedCreateVoter,
    { open: openCreateVoter, close: closeCreateVoter },
  ] = useDisclosure(false);
  const [openedBulkImport, { open: openBulkVoter, close: closeBulkVoter }] =
    useDisclosure(false);
  const [votersData, setVotersData] = useState<
    {
      id: string;
      email: string;
      accountStatus: "ACCEPTED" | "INVITED" | "DECLINED" | "ADDED";
      hasVoted: boolean;
      createdAt: Date;
    }[]
  >([]);
  const [search, setSearch] = useState("");

  const sendManyInvitationsMutation = api.voter.sendManyInvitations.useMutation(
    {
      onSuccess: async (data) => {
        await context.election.getElectionVoter.invalidate();
        notifications.show({
          title: `${data.length} invitations sent!`,
          message: "Successfully sent invitations",
          icon: <IconCheck size="1.1rem" />,
          autoClose: 5000,
        });
        closeInviteVoters();
      },
    }
  );

  const voters = api.election.getElectionVoter.useQuery(
    router.query.electionSlug as string,
    {
      enabled: router.isReady,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );
  useEffect(() => {
    setVotersData(voters.data?.voters ?? []);
  }, [voters.data?.voters, router.route]);

  return (
    <>
      <Head>
        <title>Voters | eBoto Mo</title>
      </Head>

      <Box p="md" h="100%">
        {voters.isLoading ? (
          <Center h="100%">
            <Loader size="lg" />
          </Center>
        ) : voters.isError ? (
          <Text>Error: {voters.error.message}</Text>
        ) : !voters.data ? (
          <Text>No election found</Text>
        ) : (
          <>
            <Head>
              <title>
                {voters.data.election.name} &ndash; Voters | eBoto Mo
              </title>
            </Head>
            <Modal
              opened={
                openedInviteVoters || sendManyInvitationsMutation.isLoading
              }
              onClose={closeInviteVoters}
              title={
                <Text weight={600}>
                  Are you sure you want to invite all voters?
                </Text>
              }
            >
              <Stack spacing="sm">
                <Text>
                  This will send an email to all voters that are not yet invited
                  and has status of &quot;ADDED&quot;.
                </Text>
                <Group position="right" spacing="xs">
                  <Button
                    variant="default"
                    onClick={closeInviteVoters}
                    disabled={sendManyInvitationsMutation.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={sendManyInvitationsMutation.isLoading}
                    onClick={() =>
                      sendManyInvitationsMutation.mutate({
                        electionId: voters.data.election.id,
                      })
                    }
                  >
                    Invite All
                  </Button>
                </Group>
              </Stack>
            </Modal>
            <CreateVoterModal
              isOpen={openedCreateVoter}
              electionId={voters.data.election.id}
              onClose={closeCreateVoter}
            />

            <UploadBulkVoter
              isOpen={openedBulkImport}
              electionId={voters.data.election.id}
              onClose={closeBulkVoter}
            />
            <Stack>
              <Flex
                sx={(theme) => ({
                  gap: theme.spacing.xs,

                  [theme.fn.smallerThan("xs")]: {
                    gap: theme.spacing.sm,
                    flexDirection: "column",
                  },
                })}
              >
                <Flex
                  gap="xs"
                  sx={(theme) => ({
                    [theme.fn.smallerThan("xs")]: {
                      flexDirection: "column",
                    },
                  })}
                >
                  <Flex gap="xs">
                    <Button
                      leftIcon={<IconUserPlus size="1rem" />}
                      onClick={openCreateVoter}
                      sx={(theme) => ({
                        [theme.fn.smallerThan("xs")]: {
                          width: "100%",
                        },
                      })}
                    >
                      Add voter
                    </Button>
                    <Button
                      onClick={openBulkVoter}
                      leftIcon={<IconUpload size="1rem" />}
                      variant="light"
                      sx={(theme) => ({
                        [theme.fn.smallerThan("xs")]: {
                          width: "100%",
                        },
                      })}
                    >
                      Import
                    </Button>
                  </Flex>
                  <Button
                    variant="light"
                    leftIcon={<IconMailForward size="1rem" />}
                    onClick={openInviteVoters}
                  >
                    Invite
                  </Button>
                </Flex>
                <TextInput
                  placeholder="Search by any field"
                  icon={<IconSearch size="1rem" />}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVotersData(
                      search === ""
                        ? voters.data.voters
                        : voters.data.voters.filter((voter) =>
                            voter.email
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                    );
                  }}
                  sx={{
                    flex: 1,
                  }}
                />
              </Flex>

              {!voters.data.voters.length ? (
                <Box>
                  <Text align="center">
                    <Balancer>
                      No voters found. Add one by clicking the button above.
                    </Balancer>
                  </Text>
                </Box>
              ) : (
                <Table striped highlightOnHover withBorder>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>
                        <Text align="center">Vote Status</Text>
                      </th>
                      <th>
                        <Text align="center">Account Status</Text>
                      </th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {votersData.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <Text align="center">
                            <Balancer>
                              No voters found. Try searching for something else.
                            </Balancer>
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      votersData
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        )
                        .map((voter) => (
                          <Voter
                            key={voter.id}
                            electionId={voters.data.election.id}
                            voter={voter}
                          />
                        ))
                    )}
                  </tbody>
                </Table>
              )}
            </Stack>
          </>
        )}
      </Box>
    </>
  );
};

export default DashboardVoter;
