"use client";

import React from "react";
import Image from "next/image";
import { Carousel } from "flowbite-react";

const ImagesSheet = ({ images }) => {
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
