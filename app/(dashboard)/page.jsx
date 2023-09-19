import Link from "next/link";
import IconButton from "../components/IconButton";
import { FaSearchLocation } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";

export default function Home() {
  return (
    <main className="m-5 flex justify-center items-center">
      <div className="grid grid-cols-2 gap-4">
        <div className="w-40 flex flex-col items-center bg-slate-200 rounded">
          <Link href='/search'>
            <IconButton icon={<FaSearchLocation size={50} />} text="Search" />
          </Link>
        </div>
        <div className="w-40 flex flex-col items-center bg-slate-200 rounded">
          <IconButton
            icon={<MdAddLocationAlt size={50} />}
            text="Add Location"
          />
        </div>
      </div>
    </main>
  );
}
