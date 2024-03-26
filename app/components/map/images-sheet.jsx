"use client";

import React from "react";
import Image from "next/image";
import { Carousel } from "flowbite-react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const BASE_URL =
  "https://plmqhcualnnsirfqjcsj.supabase.co/storage/v1/object/public/grave_images/";

const ImagesSheet = ({ graveId }) => {
  const supabase = createClientComponentClient();

  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    supabase
      .from("images")
      .select(
        `
        *
      `
      )
      .eq("grave", graveId)
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
        } else {
          const urls = data.map((data) => BASE_URL + data.file_name);
          setImages(urls);
        }
        setLoading(false);
      });
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-96 md:h-screen">
      <Carousel>
        {images.map((imageUrl) => (
          <Image
            key={imageUrl}
            src={imageUrl ?? ""}
            alt={imageUrl}
            height={1000}
            width={750}
            className="h-svh"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default ImagesSheet;
