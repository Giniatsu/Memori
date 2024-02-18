"use client";
import React, { useState, useEffect } from "react";
import { Label, FileInput, Button } from "flowbite-react";

export default function ImageUploadField({ id, name, existingImages }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImagesState, setExistingImagesState] = useState([]);

  // Set existing images initially
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setExistingImagesState(existingImages);
    }
  }, [existingImages]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const selectedFiles = Array.from(files);
    setSelectedImages([...selectedImages, ...selectedFiles]);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const toggleRemoveUndo = (index) => {
    const updatedExistingImages = [...existingImagesState];
    updatedExistingImages[index] = null; // Marking for removal
    setExistingImagesState(updatedExistingImages);
  };

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
        onChange={handleFileChange}
        accept="image/*"
      />
      {(selectedImages.length > 0 || existingImagesState.filter(Boolean).length > 0) && (
        <div className="mt-2">
          <h4>Selected Images:</h4>
          <ul>
            {existingImagesState.map((image, index) => (
              image && (
                <li key={index}>
                  <img
                    src={image}
                    alt={`Existing Image ${index + 1}`}
                    style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                  />
                  <Button onClick={() => toggleRemoveUndo(index)}>
                    {typeof image === "string" ? "Undo" : "Remove"}
                  </Button>
                </li>
              )
            ))}
            {selectedImages.map((file, index) => (
              <li key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected Image ${index + 1}`}
                  style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                />
                {file.name}{" "}
                <Button onClick={() => removeImage(index)}>Remove</Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

