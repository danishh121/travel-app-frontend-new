"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface TripPhotosProps {
  selectable?: boolean;
  selected?: string[];
  setSelected?: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TripPhotos({
  selectable = false,
  selected = [],
  setSelected,
}: TripPhotosProps) {
  const { photos, loading } = useSelector((state: RootState) => state.photos);

  const toggleSelect = (id: string) => {
    if (!setSelected) return; // no-op if no state setter
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center text-gray-400">No photos uploaded yet.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {photos.map((photo: any, index: number) => {
        const isSelected = selected?.includes(photo.id);

        return (
          <div
            key={photo.id || index}
            className={`relative rounded-xl overflow-hidden ${
              selectable ? "cursor-pointer" : ""
            } ${
              isSelected ? "border-4 border-green-700" : "border-transparent"
            }`}
            onClick={() => selectable && toggleSelect(photo.id)}
          >
            <Image
              src={
                photo.url || `http://localhost:8080/photos/${photo.filename}`
              }
              alt={photo.caption || "Trip Photo"}
              width={400}
              height={400}
              className="rounded-xl object-cover w-full h-40"
              unoptimized
            />

            {/* ✅ Selection Checkmark */}
            {selectable && isSelected && (
              <div className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1">
                <CheckCircle2 className="w-6 h-6 text-green-700" />
              </div>
            )}

            {photo.caption && (
              <p className="mt-1 text-sm text-gray-700 text-center">
                {photo.caption}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
