"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link, { useRouter, useParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { SmartImage } from "@/components/ui/SmartImage";
import { Skeleton } from "@/components/ui/skeleton";
import EditProfileForm from "@/components/edit_profile/EditProfile";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchProfile, fetchUserProfileById } from "@/redux/thunk/userThunk";
import {
  followUserProfile,
  unfollowUserProfile,
} from "@/redux/thunk/feedThunk";
import { IoIosArrowBack } from "react-icons/io";
import { FcPlus } from "react-icons/fc";
import UploadProfilePic from "@/components/edit_profile/UploadProfilePic";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { clearUser } from "@/redux/slices/userSlice";


const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string | undefined;
  const [followLoading, setFollowLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const { profile, loading, error, user } = useSelector(
  //   (state: RootState) => state.user
  // );
  const { profile, loading, error, user } = useSelector(
    (state: RootState) => state.user
);

  
  const isOwnProfile = profile?.id === user?.id;
  const effectRan = useRef(false);


  useEffect(() => {
    if (effectRan.current) return;
    if (!userId) {
      dispatch(clearUser()); // Optional: Clear user state if no userId
      return;
    }
    if (userId === "me") {
      dispatch(fetchProfile());
    } else {
      dispatch(fetchUserProfileById(userId));
    }
     effectRan.current = true; // mark as ran
  }, [userId, dispatch]);

  //
  const handleFollow = () => {
    if (profile) {
      dispatch(followUserProfile({ item: profile }));
    }
  };

  const handleUnfollow = () => {
    if (profile) {
      dispatch(unfollowUserProfile({ item: profile }));
    }
  };
  const handleSendMessage = () => {
    if (profile?.id) {
      router.push(`/chat?userId=${profile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-white pb-8">
        {/* Header skeleton */}
        <div className="relative">
          <div className="h-44 bg-gradient-to-b from-gray-200 to-gray-100 rounded-b-3xl animate-pulse"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-24 z-10">
            <Skeleton className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="mt-20 flex flex-col items-center px-4">
          <div className="flex gap-8 mb-2">
            <Skeleton className="w-10 h-5 rounded" />
            <Skeleton className="w-10 h-5 rounded" />
            <Skeleton className="w-10 h-5 rounded" />
          </div>

          {/* Name + bio */}
          <Skeleton className="w-32 h-6 rounded mt-2" />
          <Skeleton className="w-48 h-4 rounded mt-2" />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
            <Skeleton className="h-9 rounded-full" />
            <Skeleton className="h-9 rounded-full" />
          </div>
        </div>

        {/* Travel stats */}
        <div className="flex gap-3 justify-center mt-6 mb-6 px-4">
          <Skeleton className="flex-1 h-16 rounded-xl" />
          <Skeleton className="flex-1 h-16 rounded-xl" />
        </div>

        {/* Photos grid */}
        <div className="mt-6 px-4">
          <Skeleton className="w-40 h-5 mx-auto mb-4 rounded" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error || "Profile not found."}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white pb-8">
      {/* Header background */}
      <div className="relative">
        <div className="h-44 bg-gradient-to-b from-[#D0F5E4] to-[#F0FFF5] rounded-b-3xl">
            {/* {userId === "me" && ( */}
      {isOwnProfile && (
           <div className="relative p-6">
          <Sheet>
  <SheetTrigger asChild>
    {/* <Button variant="outline" className="absolute right-4 top-7">
      ...
    </Button> */}
    <Button
  variant="outline"
  size="icon"
  className="absolute right-4 top-7 rounded-full"
>
  <MoreVertical className="h-5 w-5" />
</Button>
  </SheetTrigger>

  <SheetContent side="right" className="w-full sm:w-[500px]">
    <SheetHeader>
      <SheetTitle className="">Edit Profile</SheetTitle>
    </SheetHeader>
    <div className="">
      <EditProfileForm />
    </div>
  </SheetContent>
</Sheet>

        </div>
      )}
        </div>
        {/* Back button */}
        <button
          className="absolute left-4 top-7 text-gray-500 hover:text-gray-700 z-10"
          onClick={() => router.back()}
        >
          <IoIosArrowBack size={30} />
        </button>
        {/* Avatar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-24 z-10">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {profile.profilePic ? (
              <Image
                src={profile.profilePic}
                alt={profile.name}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400 font-bold">
                {profile?.name?.[0] || "?"}
              </span>
            )}
            {isOwnProfile && (
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1 shadow hover:bg-green-700">
                    <FcPlus size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Upload Profile Picture</DialogTitle>
                  </DialogHeader>
                  <UploadProfilePic /> {/* ✅ reuse your upload component */}
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
   
      {/* Card with stats, name, bio, buttons */}
      <div className="mt-6 flex flex-col items-center px-4">
        
        <div className="flex gap-8 mb-3 cursor-pointer">
          <div className="flex flex-col items-center">
            <span className="font-bold text-xl">
              {profile.posts.toString().padStart(2, "0")}
            </span>
            <span className="text-xs text-gray-500 hover:text-gray-600">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-xl">
              {profile.followers.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 hover:text-gray-600">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-xl">
              {profile.following.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 hover:text-gray-600">Following</span>
          </div>
        </div>
       
        <div className="font-bold text-xl mt-1">{profile.name}</div>
        <div className="text-gray-500 text-sm text-center mt-1">
          {profile.bio}
        </div>
        

        {/* Buttons */}
        {/* {profile.id !== userId && ( */}
        {/* {userId !== "me" && ( */}
        {!isOwnProfile && (
          <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-xs">
            {profile.isFollowing ? (
              <Button
                className="bg-green-600 text-white py-2 text-sm w-full rounded-full font-semibold shadow hover:bg-green-700 transition"
                onClick={handleUnfollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : "Following"}
              </Button>
            ) : (
              <Button
                className="bg-green-600 text-white py-2 w-full rounded-full font-semibold text-sm shadow hover:bg-green-700 transition"
                onClick={handleFollow}
                disabled={followLoading}
              >
                {followLoading ? "..." : "Follow"}
              </Button>
            )}
            <Button
              className="bg-white border border-green-600 text-green-600 py-2w-full rounded-full font-semibold text-sm shadow hover:bg-green-50 transition"
              // disabled
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
          </div>
        )}
      </div>

      {/* Travel Stats */}
      <div className="flex gap-3 justify-center mt-6 mb-6 px-4">
        <div className="flex-1 bg-[#FFF4CC] rounded-xl py-4 flex flex-col items-center shadow">
          <span className="font-bold text-lg">{profile.totalDistanceKm}KM</span>
          <span className="text-xs text-gray-600">Total Distance Traveled</span>
        </div>
        <div className="flex-1 bg-[#FFF4CC] rounded-xl py-4 flex flex-col items-center shadow">
          <span className="font-bold text-lg">
            {profile.daysSpentTraveling}
          </span>
          <span className="text-xs text-gray-600">Days Spent Traveling</span>
        </div>
      </div>

      {/* Section Title */}
      <div className="mt-6 px-4">
        <h3 className="text-base font-semibold mb-3 text-gray-700 text-center border-b border-gray-200 pb-2">
          All Published Recaps & Photos
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {profile.photos?.length > 0 ? (
            profile.photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square bg-gray-100 rounded-xl overflow-hidden p-1"
              >
                <Image
                  src={photo.url}
                  alt="User photo"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">No photos available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
