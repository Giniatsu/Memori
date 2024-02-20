'use client'

import React from 'react';
import Image from "next/image";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const BASE_URL = 'https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/';

const ImagesSheet = ({ graveId }) => {
  const supabase = createClientComponentClient();

  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true)
    supabase
      .from("images")
      .select(`
        *
      `)
      .eq("grave", graveId)
      .then(({data, error}) => {
        if (error) {
          console.log(error)
        } else {
          const urls = data.map((data) => (
            BASE_URL + data.file_name
          ))
          setImages(urls); 
        }
        setLoading(false)
      })
  }, [supabase])

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
    >
      { images.map((imageUrl) => (
        <div key={imageUrl} className="w-full h-screen relative my-2">
          <Image
            fill
            src={imageUrl ?? ""}
            alt={imageUrl}
            sizes="100vw"
            objectFit="contain"
          />
        </div>
      )) }
    </div>
  );
};

export default ImagesSheet;
