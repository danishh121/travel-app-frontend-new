"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stopTrip } from "@/redux/thunk/tripsThunk";
import { uploadPhoto } from "@/redux/thunk/photoThunk";
import toast from "react-hot-toast";
import { updateTripCover } from "@/redux/slices/tripSlice";
import Image from "next/image";
import { SmartImage } from "../ui/SmartImage";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Trip as TripType } from "@/redux/slices/tripSlice";

// type Trip = {
//   id: string;
//   title: string | null;
//   description: string | null;
//   start_date: string | null;
//   end_date: string | null;
//   status: string;
//   is_draft: boolean;
//   coverImage?: string | null;
//   location?: string | null;
// };

const BASE_URL = "http://localhost:8080/photos";
export default function TripCard({ trip }: { trip: TripType }) {
  const dispatch = useDispatch<any>();

  //  const trip = useSelector((state: RootState) =>
  //   state.trips.list.find((t) => t.id === tripId)
  // );
  const [stopping, setStopping] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  // (
  //     trip?.coverPhoto ??  null
  //  ); // 👈 local state

  const router = useRouter();
  useEffect(() => {
    if (trip?.coverPhoto) setCoverPhoto(trip.coverPhoto);
    else setCoverPhoto(null); // fallback
  }, [trip]);

  const handleStopTrip = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!trip) {
      toast.error("Trip not found");
      return;
    }
    try {
      setStopping(true);
      await dispatch(stopTrip(trip.id)).unwrap();
      toast.success("Trip stopped successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to stop trip");
    } finally {
      setStopping(false);
    }
  };

  const handleCardClick = () => {
    if (!trip) return;
    router.push(`/trips/${trip.id}`);
  };

  if (!trip) {
    // Optionally render a placeholder if trip is missing
    return (
      <div className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-2xl">
        <span className="text-gray-500">Trip not found</span>
      </div>
    );
  }

  return (
    <div>
      <Card
        onClick={handleCardClick}
        className="rounded-2xl shadow-md overflow-hidden block hover:scale-[1.01] transition relative"
      >
        <div className="relative cursor-pointer">
          {coverPhoto ? (
            <Image
              src={coverPhoto}
              alt="Trip Cover"
              width={400}
              height={200}
              className="w-full h-56 object-cover rounded-2xl"
              unoptimized
            />
          ) : (
            <div className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-2xl">
              <span className="text-gray-500">No cover image</span>
            </div>
          )}

          {/* 🔹 Overlay with gradient and trip details */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-2xl" />

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
            <h3 className="text-lg sm:text-xl font-bold">
              {trip?.title ?? "Untitled Trip"}
            </h3>
            <p className="text-sm sm:text-base mt-1 line-clamp-2">
              {trip?.description ?? "No description provided."}
            </p>
            <div className="text-xs mt-2">
              {trip?.start_date && (
                <span>
                  {new Date(trip.start_date).toLocaleDateString()}{" "}
                  {trip.end_date &&
                    `- ${new Date(trip.end_date).toLocaleDateString()}`}
                </span>
              )}
            </div>
            {trip?.status && (
              <div className="mt-1 text-xs font-semibold uppercase text-green-400">
                {trip.status}
              </div>
            )}
          </div>
        </div>

        {trip?.status === "active" && (
          <div className="absolute bottom-22 right-4 z-50">
            <Button
              variant="outline"
              className="border-red-700 border-2 p-3 rounded-2xl text-red-700 bg-red-50 hover:bg-red-100"
              size="lg"
              onClick={handleStopTrip}
              disabled={stopping}
            >
              {stopping ? "Stopping..." : "Stop Trip"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
