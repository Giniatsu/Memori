import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// components
import Navigationbar from "@/app/components/Navbar";
import BottomNavbar from "../components/BottomNavbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  return (
    <div>
      {data.session && (
        <>
          <Navigationbar user={data.session.user} />
          <BottomNavbar />
        </>
      )}
      {!data.session && <Navigationbar />}
      {children}
    </div>
  );
}
