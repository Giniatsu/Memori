import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AccountForm from "./AccountForm";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex items-center justify-center my-4">
      <AccountForm session={session} />
    </main>
  );
}
