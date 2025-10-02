"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTrips, startTrip } from "@/redux/thunk/tripsThunk";
import { Button } from "@/components/ui/button";
import TripCard from "@/components/trip/TripCard";

import { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function TripsPage() {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const {
    list: trips,
    loading,
    error,
    pagination,
  } = useSelector((state: any) => state.trips);
  const { user } = useSelector((state: any) => state.user);

  // const { user } = useSelector((state: any) => state.user);
  const [tripName, setTripName] = useState("");
  const [tripDesc, setTripDesc] = useState("");
  const [open, setOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  // ✅ prevent double fetch in dev
  const [page, setPage] = useState(1);
  const effectRan = useRef(false);
  // ✅ Load first page only on mount
  useEffect(() => {
    if (effectRan.current) return; // ✅ prevent 2nd run in dev
    effectRan.current = true;
    dispatch(fetchMyTrips({ page: 1, limit: 10 }));
  }, [dispatch, router]);

  // ✅ Load more only if page > 1
  useEffect(() => {
    if (page > 1) {
      dispatch(fetchMyTrips({ page, limit: 10 }));
    }
  }, [page, dispatch]);

  // ✅ Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !pagination?.hasNextPage) return;

      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      // prevent auto-fetch if content is shorter than screen
      if (nearBottom && document.body.offsetHeight > window.innerHeight) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, pagination]);
  const handleStartTrip = async () => {
    try {
      setStarting(true);

      // ✅ unwrap gives you the created trip object
      const newTrip = await dispatch(
        startTrip({ name: tripName, description: tripDesc })
      ).unwrap();

      setOpen(false);
      setTripName("");
      setTripDesc("");

      // ✅ redirect to new trip detail page
      router.push(`/trips/${newTrip.id}`);
    } catch (err) {
      console.error("Start trip failed:", err);
    } finally {
      setStarting(false);
    }
  };

  // const handleStartTrip = async () => {
  //   try {

  //     setStarting(true);
  //     await dispatch(
  //       startTrip({ title: tripName, description: tripDesc })
  //     ).unwrap();
  //     setOpen(false);
  //     setTripName("");
  //     setTripDesc("");
  //   } catch (err) {
  //     console.error("Start trip failed:", err);
  //   } finally {
  //     setStarting(false);
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-green-50 px-2 sm:px-4">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl border mb-20 bg-green-100 relative pl-3 pr-3">
        {/* 🔹 Loading skeleton */}
        {loading && trips.length === 0 ? (
          <div className="p-6 space-y-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg mb-4" />
            ))}
          </div>
        ) : (
          <>
            {/* 🔹 Error */}
            {error && (
              <div className="p-6 text-center text-red-500">{error}</div>
            )}

            {/* 🔹 No trips */}
            {!error && trips.length === 0 && (
              <div className="p-6 text-center text-gray-700">
                Welcome <span className="font-semibold">{user?.name}</span>!
                <br />
                You don’t have any trips yet. Start your first trip below.
              </div>
            )}

            {/* 🔹 Trips list */}
            {trips.length > 0 && (
              <>
                <div className="mb-3 mt-6 ml-5">
                  <h1 className="text-lg font-medium">
                    Welcome{" "}
                    <span className="text-green-600 text-2xl">
                      {" "}
                      {user?.name}
                    </span>
                  </h1>
                </div>

                <div className="grid gap-3">
                  {trips.map((trip: any) => (
                    <Card key={trip.id} className="overflow-hidden shadow-md">
                      <CardContent className="p-0 relative">
                        <TripCard trip={trip} />

                        {/* Yellow label */}
                        <span className="absolute top-3 left-3 bg-yellow-400 text-black text-sm font-semibold px-3 py-1 rounded">
                          {trip.location}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* 🔹 Start New Trip Button */}
            <div className="fixed bottom-20 right-1/2 transform translate-x-1/2 z-50 max-w-lg w-full px-4">
              <div className="w-full flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-2xl px-6 py-3">
                      {starting ? "Loading..." : "Start New Trip"}
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Start a New Trip</DialogTitle>
                      <DialogDescription>
                        Enter a name for your new trip.
                      </DialogDescription>
                    </DialogHeader>

                    <Input
                      placeholder="Trip Name"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      className="my-3"
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={tripDesc}
                      onChange={(e) => setTripDesc(e.target.value)}
                      className="my-2"
                    />

                    <DialogFooter className="flex justify-end gap-2">
                      <Button
                        className="bg-green-700 hover:bg-green-800"
                        onClick={() => setOpen(false)}
                        disabled={starting}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-700 hover:bg-green-800"
                        onClick={handleStartTrip}
                        disabled={starting || !tripName}
                      >
                        {starting ? "Starting..." : "Start Trip"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
