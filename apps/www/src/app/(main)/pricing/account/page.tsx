import AccountPageClient from "@/components/client/pages/account";
import { notFound } from "next/navigation";

import { auth } from "@fleabay/auth";

export default async function AccountPage() {
  const session = await auth();

  if (!session) notFound();

  return <AccountPageClient session={session} />;
}
