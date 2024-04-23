import Link from "next/link";
import IconButton from "../components/IconButton";
import { FaSearchLocation } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { SiOpenstreetmap } from "react-icons/si";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import InstructionManual from "./InstructionManual";
import "@khmyznikov/pwa-install";

export default async function Home({ searchParams }) {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  return (
    <>
      <pwa-install></pwa-install>
      <main className="m-5 grid grid-cols-1 justify-items-center">
        {searchParams?.auth_error === "EXCHANGE_FAILED" && (
          <div className="m-4 bg-green-700 text-white p-4 rounded-lg">
            <h1 className="mb-3 text-lg">Email verified</h1>
            Your email has been verified! You may now login.
          </div>
        )}
        {!data.session && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-40 flex flex-col items-center bg-green-700 rounded">
                <Link href="/search" className="m-auto">
                  <IconButton
                    icon={<FaSearchLocation size={50} />}
                    text="Search for a Grave"
                  />
                </Link>
              </div>
              <div className="w-40 flex flex-col items-center bg-green-700 rounded">
                <Link href="/login" className="m-auto">
                  <IconButton
                    icon={<MdAddLocationAlt size={50} />}
                    text={
                      data.session ? "Add Location" : "Login to Add Location"
                    }
                  />
                </Link>
              </div>
            </div>
            <InstructionManual />
          </>
        )}
        {data.session && <InstructionManual />}
      </main>
    </>
  );
}
