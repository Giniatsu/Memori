"use client";
import {
  Label,
  FileInput,
} from "flowbite-react";

export default function ImageUploadField({
  id,
  name,
}) {
  return (
    <>
      <div className="block mb-2">
        <Label htmlFor="file" value="Upload file" />
      </div>
      <FileInput
        helperText="Add helpful images to identify gravesite"
        id={id}
        name={name}
        multiple
      />
    </>
  );
}
