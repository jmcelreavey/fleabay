"use client";

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconEdit,
  IconRefresh,
  IconTrash,
  IconUpload,
  IconUserMinus,
} from "@tabler/icons-react";
import {
  MantineReactTable,
  type MRT_RowSelectionState,
  type MRT_ColumnDef,
} from "mantine-react-table";
import moment from "moment";
import type { VoterField, Election } from "@eboto-mo/db/schema";
import { useMemo } from "react";
import InviteAllInvitedVoters from "@/components/client/modals/invite-all-invited-voters";
import UpdateVoterField from "@/components/client/modals/update-voter-field";
import CreateVoter from "@/components/client/modals/create-voter";

export default function DashboardVoter({
  election,
  voters,
}: {
  election: Election & { voter_fields: VoterField[] };
  voters: {
    id: string;
    email: string;
    account_status: string;
    created_at: Date;
    has_voted: boolean;
    field: unknown;
  }[];
}) {
  const columns = useMemo<MRT_ColumnDef<(typeof voters)[0]>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
      },
      ...((election.voter_fields.map((voter_field) => ({
        accessorKey: "field." + voter_field.name,
        header: voter_field.name,
      })) ?? []) as MRT_ColumnDef<(typeof voters)[0]>[]),
      {
        accessorKey: "account_status",
        header: "Status",
        size: 75,
        enableClickToCopy: false,
        Cell: ({ cell }) =>
          cell.getValue<string>().charAt(0) +
          cell.getValue<string>().slice(1).toLowerCase(),
      },
      {
        accessorKey: "has_voted",
        header: "Voted?",
        size: 75,
        Cell: ({ cell }) => (cell.getValue<boolean>() ? "Yes" : "No"),
        enableClickToCopy: false,
      },
      {
        accessorKey: "created_at",
        header: "Created",
        size: 100,
        Cell: ({ cell }) => moment(cell.getValue<Date>()).fromNow(),
      },
    ],
    [election.voter_fields]
  );

  return (
    <Box p="md">
      {/* <EditVoterModal
        isOpen={openedEditVoter}
        voterFields={voters.data.election.voter_fields}
        electionId={voters.data.election.id}
        onClose={closeEditVoter}
        voter={voterToEdit}
      />

      <UploadBulkVoter
        isOpen={openedBulkImport}
        electionId={voters.data.election.id}
        voterFields={voters.data.election.voter_fields}
        onClose={closeBulkVoter}
      />

      <ConfirmDeleteVoterModal
        voter={voterToDelete}
        isOpen={openedConfirmDeleteVoter}
        electionId={voters.data.election.id}
        onClose={closeConfirmDeleteVoter}
      />

      <ConfirmDeleteBulkVoterModal
        voters={voters
          .filter((voter) => rowSelection[voter.id])
          .map((voter) => ({
            id: voter.id,
            email: voter.email,
          }))}
        setRowSelection={setRowSelection}
        isOpen={openedConfirmDeleteBulkVoters}
        electionId={voters.data.election.id}
        onClose={closeConfirmDeleteBulkVoters}
      />

      <Stack>
        <Flex
          gap="xs"
          sx={(theme) => ({
            [theme.fn.smallerThan("xs")]: {
              flexDirection: "column",
            },
          })}
        >
          <Flex gap="xs">
            <CreateVoter
              voter_fields={election.voter_fields}
              election_id={election.id}
            />

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
          <Flex gap="xs">
            <Tooltip
              label={
                <Text>
                  You can&apos;t change the voter&apos;s group once the <br />
                  election is ongoing and if there&apos;s already a voter
                </Text>
              }
            >
              <UpdateVoterField
                election={election}
                voter_fields={election.voter_fields}
              />
            </Tooltip>

            {isElectionOngoing({
              election: election,
              withTime: true,
            }) && <InviteAllInvitedVoters eleciton_id={election.id} />}
          </Flex>
        </Flex>

        <MantineReactTable
          columns={columns}
          data={voters}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          enableRowSelection
          enableColumnOrdering
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          enableStickyHeader
          initialState={{
            density: "xs",
            pagination: { pageSize: 15, pageIndex: 0 },
          }}
          state={{
            isLoading: voters.isLoading,
            showAlertBanner: voters.isError,
            rowSelection,
          }}
          enableClickToCopy={true}
          mantineTableContainerProps={{
            sx: { maxHeight: "70vh" },
            width: "100%",
          }}
          mantineProgressProps={({ isTopToolbar }) => ({
            sx: {
              display: isTopToolbar ? "block" : "none",
            },
          })}
          positionToolbarAlertBanner="bottom"
          renderTopToolbarCustomActions={() => (
            <Group spacing="xs">
              <Tooltip withArrow label="Refresh">
                <ActionIcon
                  variant="light"
                  onClick={() => voters.refetch()}
                  loading={voters.isRefetching}
                  size="lg"
                  sx={(theme) => ({
                    [theme.fn.largerThan("xs")]: {
                      display: "none",
                    },
                  })}
                  loaderProps={{
                    width: 18,
                  }}
                >
                  <IconRefresh size="1.25rem" />
                </ActionIcon>
              </Tooltip>

              <Tooltip withArrow label="Delete selected">
                <ActionIcon
                  color="red"
                  onClick={openConfirmDeleteBulkVoters}
                  size="lg"
                  variant="outline"
                  sx={(theme) => ({
                    [theme.fn.largerThan("xs")]: {
                      display: "none",
                    },
                  })}
                  disabled={
                    voters.isLoading ||
                    !voters.data ||
                    Object.keys(rowSelection).length === 0
                  }
                >
                  <IconUserMinus size="1.25rem" />
                </ActionIcon>
              </Tooltip>
              <Button
                variant="light"
                onClick={() => voters.refetch()}
                loading={voters.isRefetching}
                leftIcon={<IconRefresh size="1.25rem" />}
                sx={(theme) => ({
                  [theme.fn.smallerThan("xs")]: {
                    display: "none",
                  },
                })}
                loaderProps={{
                  width: 20,
                }}
              >
                Refresh
              </Button>
              <Button
                color="red"
                variant="outline"
                onClick={openConfirmDeleteBulkVoters}
                disabled={
                  voters.isLoading ||
                  !voters.data ||
                  Object.keys(rowSelection).length === 0
                }
                leftIcon={<IconUserMinus size="1.25rem" />}
                sx={(theme) => ({
                  [theme.fn.smallerThan("xs")]: {
                    display: "none",
                  },
                })}
              >
                Delete selected
              </Button>
            </Group>
          )}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "16px" }}>
              <Tooltip withArrow label="Edit">
                <ActionIcon
                  onClick={() => {
                    setVoterToEdit({
                      id: row.id,
                      email: row.getValue<string>("email"),
                      field: voters.find((v) => v.id === row.id)?.field ?? {},
                      accountStatus: row.getValue<
                        "ACCEPTED" | "INVITED" | "DECLINED" | "ADDED"
                      >("accountStatus"),
                    });
                    openEditVoter();
                  }}
                >
                  <IconEdit size="1.25rem" />
                </ActionIcon>
              </Tooltip>

              <Tooltip withArrow label="Delete">
                <ActionIcon
                  color="red"
                  onClick={() => {
                    setVoterToDelete({
                      id: row.id,
                      email: row.getValue<string>("email"),
                      accountStatus: row.getValue<
                        "ACCEPTED" | "INVITED" | "DECLINED" | "ADDED"
                      >("accountStatus"),
                    });
                    openConfirmDeleteVoter();
                  }}
                >
                  <IconTrash size="1.25rem" />
                </ActionIcon>
              </Tooltip>
            </Box>
          )}
        />
      </Stack> */}
    </Box>
  );
}
