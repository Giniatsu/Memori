import Link from "next/link";
import IconButton from "../components/IconButton";
import { FaSearchLocation } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { SiOpenstreetmap } from "react-icons/si";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  return (
    <main className="m-5 flex justify-center items-center">
      {!data.session && (
        <div className="grid grid-cols-2 gap-4">
          <div className="w-40 flex flex-col items-center bg-slate-200 rounded">
            <Link href="/search">
              <IconButton icon={<FaSearchLocation size={50} />} text="Search" />
            </Link>
          </div>
          <div className="w-40 flex flex-col items-center bg-slate-200 rounded">
            <Link href='/login'>
              <IconButton
                icon={<MdAddLocationAlt size={50} />}
                text={data.session ? "Add Location" : "Login to Add Location"}
              />
            </Link>
          </div>
          {/* <div className="w-40 flex flex-col items-center bg-slate-200 rounded justify-center">
            <Link href="/map">
              <IconButton
                icon={<SiOpenstreetmap size={50} />}
                text="View Map"
              />
            </Link>
          </div> */}
        </div>
      )}
    </main>
  );
}
