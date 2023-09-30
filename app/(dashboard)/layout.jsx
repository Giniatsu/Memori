import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// components
import Navigationbar from "@/app/components/Navbar";
import BottomNavbar from "../components/BottomNavbar";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  let profile;
  if(data.session){
    // Get the user's profile data from Supabase.
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id)
      .single();
    profile = profileData;
    const avatarUrl = await supabase.storage
      .from("avatars")
      .createSignedUrl(profile.avatar_url, 60000);
    profile.avatar_url = avatarUrl;
  }
  

  return (
    <div>
      {data.session && (
        <>
          <Navigationbar user={data.session.user} profile={profile} avatarUrl={profile.avatar_url}/>
          <BottomNavbar />
        </>
      )}
      {!data.session && <Navigationbar />}
      {children}
    </div>
  );
}
