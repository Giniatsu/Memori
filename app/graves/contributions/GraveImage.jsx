

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

const BASE_URL = 'https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/';

async function getImage(grave_id) {
  const supabase = createServerComponentClient({ cookies });

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

  return dbData.map((data) => {
    return BASE_URL + data.file_name;
  });

  /*
  try {
    const { data, error } = await supabase.storage
      .from("grave_images")
      .download(file_name);
    if (error) {
      throw error;
    }

    const url = URL.createObjectURL(data);

    return url;
  } catch (error) {
    console.log("Error downloading image: ", error);
    return null;
  }
  */
}

export default async function GraveImage({ grave_id }) {
  const imageUrls = await getImage(grave_id);

  return (
    <>
      { imageUrls.map((imageUrl) => (
        <Image
          src={imageUrl ?? ""}
          alt=""
          height={384}
          width={384}
          className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        />
      )) }
    </>
  );
}
