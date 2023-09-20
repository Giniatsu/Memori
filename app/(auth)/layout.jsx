import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navigationbar from "../components/Navbar";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    redirect("/");
  }
  return (
    <>
      <Navigationbar />
      {children}
    </>
  );
}
