"use client";
import React, { useState, useEffect, useRef } from "react";
import { Label, FileInput, Button } from "flowbite-react";

export default function ImageUploadField({ id, name, existingImages }) {
  const fileInputRef = useRef();
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImagesState, setExistingImagesState] = useState([]);

  // Set existing images initially
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      setExistingImagesState(existingImages.map(img => ({ markedForDeletion: false, url: img })));
    }
  }, [existingImages]);

  useEffect(() => {
    // Sync selectedImages state to the HTML state
    if (!fileInputRef) {
      return;
    }
    const dataTransfer = new DataTransfer();
    selectedImages.forEach(file => dataTransfer.items.add(file));
    const fileInput = fileInputRef.current;
    fileInput.files = dataTransfer.files;
  }, [selectedImages]);

  const handleFileChange = async (event) => {
    const files = event.target.files;

    // Compress image until file size is less than or equal maxSizeKB
    const compressedImages = await Promise.all(
      Array.from(files).map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const maxWidth = 1000; // Adjust maximum width as needed
              const maxHeight = 1000; // Adjust maximum height as needed
              const maxSizeKB = 1024; // Desired maximum file size in kilobytes

              let width = img.width;
              let height = img.height;

              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0, width, height);

              let quality = 0.7; // Initial quality
              let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
              while (compressedDataUrl.length / 1024 > maxSizeKB && quality > 0.1) {
                quality -= 0.1;
                compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
              }

              // Convert data URL to Blob
              const byteString = atob(compressedDataUrl.split(',')[1]);
              const arrayBuffer = new ArrayBuffer(byteString.length);
              const uint8Array = new Uint8Array(arrayBuffer);
              for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
              }
              const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            };
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setSelectedImages([...selectedImages, ...compressedImages]);
  };

  //const handleFileChange = (event) => {
  //  const files = event.target.files;
  //  const selectedFiles = Array.from(files);
  //  setSelectedImages([...selectedImages, ...selectedFiles]);
  //};

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const toggleRemoveUndo = (index) => {
    setExistingImagesState(prev => {
      return prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            markedForDeletion: !item.markedForDeletion
          };
        }
        return item;
      });
    })   
  };

  return (
    <>
      <div className="block mb-2">
        <Label htmlFor="file" value="Upload file" />
      </div>
      <FileInput
        ref={fileInputRef}
        helperText="Add helpful images to identify gravesite"
        id={id}
        name={name}
        multiple
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
      />
      {existingImagesState.map(image => image.markedForDeletion && (
        <input key={image.url} type="checkbox" className="hidden" name="imagesForDeletion" value={image.url} checked />
      ))}
      {(selectedImages.length > 0 || existingImagesState.filter(Boolean).length > 0) && (
        <div className="mt-2">
          <h4>Images:</h4>
          <ul>
            {existingImagesState.map((image, index) => (
              image && (
                <li key={`existing_${index}`}>
                  <img
                    src={image.url}
                    alt={`Existing Image ${index + 1}`}
                    style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                  />
                  <Button onClick={() => toggleRemoveUndo(index)}>
                    {image.markedForDeletion ? "Undo" : "Remove"}
                  </Button>
                </li>
              )
            ))}
            {selectedImages.map((file, index) => (
              <li key={`selected_${index}`}>
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

