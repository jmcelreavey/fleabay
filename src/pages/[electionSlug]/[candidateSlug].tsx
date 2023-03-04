import { Container, Text } from "@chakra-ui/react";
import type { Candidate, Election, Partylist } from "@prisma/client";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../../server/auth";
import { prisma } from "../../server/db";

const CandidatePage = ({
  election,
  candidate,
}: {
  election: Election;
  candidate: Candidate & {
    partylist: Partylist;
  };
}) => {
  return (
    <Container maxW="4xl">
      <Text>{election.name}</Text>
      <Text>
        {candidate.first_name} ({candidate.partylist.acronym})
      </Text>
    </Container>
  );
};

export default CandidatePage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (
    !context.query.electionSlug ||
    !context.query.candidateSlug ||
    typeof context.query.electionSlug !== "string" ||
    typeof context.query.candidateSlug !== "string"
  )
    return { notFound: true };

  const session = await getServerAuthSession(context);
  const election = await prisma.election.findFirst({
    where: {
      slug: context.query.electionSlug,
      candidates: {
        some: {
          slug: context.query.candidateSlug,
        },
      },
    },
  });

  if (!election) return { notFound: true };

  switch (election.publicity) {
    case "PRIVATE":
      if (!session)
        return { redirect: { destination: "/signin", permanent: false } };

      const commissioner = await prisma.commissioner.findFirst({
        where: {
          electionId: election.id,
          userId: session.user.id,
        },
      });

      if (!commissioner) return { notFound: true };
      break;
    case "VOTER":
      if (!session)
        return { redirect: { destination: "/signin", permanent: false } };

      const voter = await prisma.voter.findFirst({
        where: {
          electionId: election.id,
          userId: session.user.id,
        },
      });

      if (!voter)
        return {
          redirect: { destination: "/signin", permanent: false },
        };
      break;
  }

  const candidate = await prisma.candidate.findFirst({
    where: {
      electionId: election.id,
      slug: context.query.candidateSlug,
    },
    include: {
      partylist: true,
    },
  });

  if (!candidate) return { notFound: true };

  return {
    props: {
      election: {
        ...election,
        start_date: election.start_date.toISOString(),
        end_date: election.end_date.toISOString(),
        createdAt: election.createdAt.toISOString(),
        updatedAt: election.updatedAt.toISOString(),
      },
      candidate: {
        ...candidate,
        createdAt: candidate.createdAt.toISOString(),
        updatedAt: candidate.updatedAt.toISOString(),

        partylist: {
          ...candidate.partylist,
          createdAt: candidate.partylist.createdAt.toISOString(),
          updatedAt: candidate.partylist.updatedAt.toISOString(),
        },
      },
    },
  };
};