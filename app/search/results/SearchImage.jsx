

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const BASE_URL = 'https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/';

async function getImage(grave_id) {
  const supabase = createClientComponentClient();

  const { data: dbData, error: dbError } = await supabase
    .from("images")
    .select(`
      *
    `)
    .eq("grave", grave_id);

  if (dbError) {
    console.log(dbError.message);
  }

  if (!dbData || dbData.length === 0) {
    return null;
  }

  const { file_name } = dbData[0];

  return BASE_URL + file_name;
}

export default async function GraveImage({ grave_id }) {
  const imageUrl = await getImage(grave_id);

  return (
    <>
      <Image
        src={imageUrl ?? ""}
        alt=""
        height={384}
        width={384}
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
      />
    </>
  );
}
