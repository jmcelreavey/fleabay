import {
  Button,
  Text,
  Table,
  TextInput,
  Flex,
  Box,
  Stack,
} from "@mantine/core";
import { useDidUpdate, useDisclosure } from "@mantine/hooks";
import { IconSearch, IconUpload, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/router";
import CreateVoterModal from "../../../components/modals/CreateVoter";
import Voter from "../../../components/Voter";
import { api } from "../../../utils/api";
import Balancer from "react-wrap-balancer";
import UploadBulkVoter from "../../../components/modals/UploadBulkVoter";
import { useState } from "react";

const DashboardVoter = () => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedBulkImport, { open: openBulkVoter, close: closeBulkVoter }] =
    useDisclosure(false);
  const [votersData, setVotersData] = useState<
    {
      id: string;
      email: string;
      status: "ACCEPTED" | "INVITED" | "DECLINED";
    }[]
  >([]);
  const [search, setSearch] = useState("");

  const voters = api.election.getElectionVoter.useQuery(
    router.query.electionSlug as string,
    {
      enabled: router.isReady,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );
  useDidUpdate(() => {
    setVotersData(voters.data?.voters ?? []);
  }, [voters.data?.voters]);

  if (voters.isLoading) return <Text>Loading...</Text>;

  if (voters.isError) return <Text>Error: {voters.error.message}</Text>;

  if (!voters.data) return <Text>No election found</Text>;

  return (
    <>
      <CreateVoterModal
        isOpen={opened}
        electionId={voters.data.election.id}
        onClose={close}
        refetch={voters.refetch}
      />

      <UploadBulkVoter
        isOpen={openedBulkImport}
        electionId={voters.data.election.id}
        onClose={closeBulkVoter}
        refetch={voters.refetch}
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
          <Flex gap="xs">
            <Button
              leftIcon={<IconUserPlus size="1rem" />}
              onClick={open}
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
                  <Text align="center">Status</Text>
                </th>
                <th />
              </tr>
            </thead>

            <tbody>
              {votersData.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <Text align="center">
                      <Balancer>
                        No voters found. Try searching for something else.
                      </Balancer>
                    </Text>
                  </td>
                </tr>
              ) : (
                votersData.map((voter) => (
                  <Voter
                    key={voter.id}
                    electionId={voters.data.election.id}
                    voter={voter}
                    refetch={async () => {
                      await voters.refetch();
                      setSearch("");
                    }}
                  />
                ))
              )}
            </tbody>
          </Table>
        )}
      </Stack>
    </>
  );
};

export default DashboardVoter;
