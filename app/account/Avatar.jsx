"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Avatar, Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";

export default function TheAvatar({ uid, url, size, onUpload }) {
  const supabase = createClientComponentClient();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="mb-3 rounded-full shadow-lg"
          style={{ height: size, width: size }}
        />
      ) : (
        <Avatar rounded size="xl" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        {uploading ? (
          <Button
            isProcessing
            processingSpinner={
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
            }
            disabled={uploading}
            className="mx-auto"
          >
            <label htmlFor="single">Uploading...</label>
          </Button>
        ) : (
          <Button type="file" className="mx-auto">
            <label htmlFor="single">Upload</label>
          </Button>
        )}
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
            width: 0,
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
