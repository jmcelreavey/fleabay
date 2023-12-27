import DashboardPartylist from "@/components/client/pages/dashboard-partylist";
import { api } from "@/trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { db } from "@fleabay/db";

export const metadata: Metadata = {
  title: "Partylists",
};

export default async function Page({
  params: { electionDashboardSlug },
}: {
  params: { electionDashboardSlug: string };
}) {
  const election = await db.query.elections.findFirst({
    where: (elections, { eq, and, isNull }) =>
      and(
        eq(elections.slug, electionDashboardSlug),
        isNull(elections.deleted_at),
      ),
  });

  if (!election) notFound();

  const partylists = await api.partylist.getDashboardData.query({
    election_id: election.id,
  });

  return <DashboardPartylist election={election} partylists={partylists} />;
}
