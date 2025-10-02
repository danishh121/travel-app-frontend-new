"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { clearCurrentTrip } from "@/redux/slices/tripSlice";
import { fetchTripById } from "@/redux/thunk/tripsThunk";
import { AppDispatch, RootState } from "@/redux/store";
import TripCard from "@/components/trip/TripCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchTripPhotos, uploadPhoto } from "@/redux/thunk/photoThunk";
import toast from "react-hot-toast";

import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/components/ui/SmartImage";
import TripPhotos from "@/components/trip/TripPhotos";
import { updateTripCover } from "@/redux/slices/tripSlice";

export default function TripDetailPage() {
  const { tripId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const {
    currentTrip,
    loading: tripLoading,
    error: tripError,
  } = useSelector((state: RootState) => state.trips);
  const {
    photos,
    loading: photosLoading,
    error: photosError,
  } = useSelector((state: RootState) => state.photos);
  const effectRan = useRef(false);

  // useEffect(()=>{
  //   if(!token){
  //   router.push('/login')
  //   }
  // },[token, router])

  // Fetch trip details & photos
  useEffect(() => {
    if (effectRan.current) return; // ⛔ block 2nd run in dev
    effectRan.current = true;
    if (!tripId || Array.isArray(tripId)) {
      toast.error("Invalid Trip ID");
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(fetchTripById(tripId)).unwrap();
        await dispatch(fetchTripPhotos(tripId)).unwrap();
      } catch (err) {
        console.error("Failed to fetch trip data", err);
      }
    };

    fetchData();

    return () => {
      dispatch(clearCurrentTrip());
    };
  }, [dispatch, tripId]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a photo");
      return;
    }

    try {
      const uploaded = await dispatch(
        uploadPhoto({
          tripId: tripId as string,
          file,
          caption: caption || "Photo",
        })
      ).unwrap();

      toast.success("Photo uploaded successfully!");
      dispatch(
        updateTripCover({ tripId: tripId as string, coverUrl: uploaded.url })
      );
      setOpen(false);
      setFile(null);
      setCaption("");
      dispatch(fetchTripPhotos(tripId as string));
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);
      toast.error(err.message || "Upload failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (tripLoading || photosLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50 px-2 sm:px-4">
        <Card className="w-full max-w-xl rounded-2xl shadow-lg bg-green-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* TripCard area */}
            <Skeleton className="h-48 w-full rounded-2xl" />

            {/* Upload button placeholder */}
            <Skeleton className="h-10 w-full rounded-xl" />

            {/* Photos grid placeholder */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  // ❌ Error state (e.g. Trip not found)
  if (tripError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 px-2">
        <Card className="w-full max-w-md text-center p-6 bg-red-100 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p className="mt-2 text-red-600">{tripError}</p>
          <Button
            className="mt-4 bg-green-700 hover:bg-green-800"
            onClick={() => router.push("/trips")}
          >
            Back to My Trips
          </Button>
        </Card>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-2 pb-24 sm:px-4">
      <Card className="w-full max-w-xl mt-8 rounded-2xl shadow-lg bg-green-100">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-center flex-1">
            Trip Details
          </h1>
        </CardHeader>

        <CardContent>
          {/* {currentTrip && <TripCard trip={currentTrip} />} */}
          {currentTrip && (
            <TripCard
              trip={{
                ...currentTrip,
                coverPhoto: currentTrip.coverPhoto || photos[0]?.url || null,
              }}
            />
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full bg-green-700 hover:bg-green-800 mt-4 mb-4"
              >
                Upload Photo
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-md p-0 overflow-hidden rounded-2xl"
              aria-describedby={undefined}
            >
              <DialogHeader className="p-4 border-b">
                <DialogTitle className="text-center w-full">
                  Create New Post
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col space-y-4 p-4">
                {/* Image Preview */}
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      width={400}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400">
                      Choose a photo to preview
                    </span>
                  )}
                </div>

                {/* File input */}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {/* Caption */}
                <Textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="resize-none"
                />

                {/* Upload Button */}
                <Button
                  onClick={() => {
                    handleUpload();
                    setOpen(false);
                    setFile(null);
                    setCaption("");
                  }}
                  disabled={!file}
                  className="w-full bg-green-700 hover:bg-green-800"
                >
                  Share
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Photos section (same width as card) */}
          <TripPhotos />
          <div>
            <Button
              className="w-full bg-green-700 hover:bg-green-800 mt-4"
              onClick={() => router.push(`/animation?tripId=${tripId}`)}
            >
              Generate Animation
            </Button>
          </div>
          {/* Footer with same width */}
          <div className="w-full max-w-xl mx-auto mt-6"></div>
        </CardContent>
      </Card>
    </div>
  );
}
