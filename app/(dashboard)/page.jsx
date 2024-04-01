import Link from "next/link";
import IconButton from "../components/IconButton";
import { FaSearchLocation } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { SiOpenstreetmap } from "react-icons/si";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import InstructionManual from "./InstructionManual";
export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  return (
    <main className="m-5 justify-center items-center">
      {!data.session && (
        <div className="grid-flow-col grid-row-2 gap-4 p-10 rounded">
          <div className="grid grid-cols-2 gap-4">
            {/* Centered content within each grid column */}
            <div className="flex flex-col items-center bg-green-700 shadow-md mb-2">
              <Link href="/search" style={{ margin: "auto" }}>
                <IconButton
                  icon={<FaSearchLocation size={50} />}
                  text="Search"
                />
              </Link>
            </div>
            <div className="flex flex-col items-center bg-green-700 shadow-md mb-2">
              <Link href="/login" style={{ margin: "auto" }}>
                <IconButton
                  icon={<MdAddLocationAlt size={50} />}
                  text={data.session ? "Add Location" : "Login to Add Location"}
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center mt-10, mx-1">
            <div style={{ margin: "auto" }}>
              <InstructionManual />
            </div>
          </div>
        </div>
      )}
      {data.session && <InstructionManual />}
    </main>
  );
}
