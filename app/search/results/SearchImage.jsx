

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";

const BASE_URL = 'https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/';

async function getImage(grave_id) {
  const supabase = createClientComponentClient();

  const { data: dbData, error: dbError } = await supabase
    .from("images")
    .select(`
      file_name
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

export default function GraveImage({ grave_id }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    setLoading(true)
    getImage(grave_id).then((url) => {
      setImageUrl(url)
      setLoading(false)
    })
  }, [grave_id])

  return !loading && !!imageUrl && (
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
