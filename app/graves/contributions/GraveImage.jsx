'use client'
import { useState, useEffect } from "react";
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

  return dbData.map((data) => (
    BASE_URL + data.file_name
  ))
}

export default function GraveImage({ grave_id, multiple }) {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  useEffect(() => {
    setLoading(true)
    getImage(grave_id).then((urls) => {
      setImageUrls(urls)
      setLoading(false)
    })
  }, [grave_id])
 
  if (multiple) {
    return !loading && (
      <>
        { imageUrls.map((imageUrl) => (
          <Image
            key={imageUrl}
            src={imageUrl ?? ""}
            alt=""
            height={384}
            width={384}
            className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
          />
        ))
        }
      </>
    )
  }

  return !loading && (
    <>
      <Image
        src={imageUrls[0] ?? ""}
        alt=""
        height={384}
        width={384}
        className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
      />
    </>
  );
}
