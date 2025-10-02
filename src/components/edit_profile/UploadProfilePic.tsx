"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { uploadProfilePicture } from "@/redux/thunk/userThunk";

export default function UploadProfilePic() {
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    setMessage("Uploading...");
    try {
      const result = await dispatch(uploadProfilePicture(file)).unwrap();
      setMessage("Upload successful!");
      
      // Update preview with the new profile picture URL returned from backend
      setPreview(result.profilePicUrl);

      console.log("Updated user:", result.user);
    } catch (err: any) {
      setMessage(err.message || "Upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-full border"
        />
      )}

      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
