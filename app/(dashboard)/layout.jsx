import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// components
import Navigationbar from "@/app/components/Navbar";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  return (
    <>
      {data.session && <Navigationbar user={data.session.user} />}
      {!data.session && <Navigationbar />}
      {children}
    </>
  );
}
