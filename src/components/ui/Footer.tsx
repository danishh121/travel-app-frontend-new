"use client";

import React from "react";
import { Home, Users, Heart, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "./card";
import Link from "next/link";
import UserProfileIcon from "../edit_profile/UserProfileIcon";

import { useRouter } from "next/navigation";


const Footer = () => {
 
  const router = useRouter();
 

    
  
  const handleProfileClick = () => {
    
      
      router.push("/profile/me"); // 👈 fallback if not logged in
    
  };



  return (
    // <Card className="w-full max-w-xl fixed bottom-6 left-0 right-0 mx-auto bg-green-100 rounded-t-lg shadow-lg">
    //   <CardContent className="p-2 sm:p-4 flex items-center justify-between text-gray-500 pb-2 sm:pb-4">
    //     <div className="flex w-full justify-between items-center gap-2 sm:gap-4">
    //       {/* Home */}
    //       <Link href="/" className="flex-1 flex justify-center">
    //         <Home className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
    //       </Link>

    //       {/* Users */}
    //       <Link href="/search_users" className="flex-1 flex justify-center">
    //         <Users className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
    //       </Link>

    //       {/* Start New Trip */}
    //       <Link href="/trips" className="flex-1 flex justify-center">
    //         <LayoutDashboard className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
    //       </Link>

    //       {/* Likes */}
    //       <Link href="/likes" className="flex-1 flex justify-center">
    //         <Heart className="transition-transform duration-300 hover:scale-110 hover:text-green-600" />
    //       </Link>

    //        {/* User Profile */}
    //        <button onClick={handleProfileClick} className="flex-1 flex justify-center">
    //         <UserProfileIcon />
    //       </button>
      
    //     </div>
    //   </CardContent>
    // </Card>
    <Card className="w-full max-w-xl fixed bottom-6 left-0 right-0 mx-auto bg-white rounded-2xl shadow-xl border border-emerald-100 transition-all duration-300 ease-in-out">
      <CardContent className="p-3 sm:p-4 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex w-full justify-between items-center gap-2 sm:gap-4">
          {/* Home */}
          <Link
            href="/"
            className="flex-1 flex justify-center"
            aria-label="Go to Home"
          >
            <Home
              className="w-6 h-6 text-emerald-700 transition-all duration-200 ease-in-out hover:scale-110 hover:text-emerald-500"
            />
          </Link>

          {/* Users */}
          <Link
            href="/search_users"
            className="flex-1 flex justify-center"
            aria-label="Go to Search Users"
          >
            <Users
              className="w-6 h-6 text-emerald-700 transition-all duration-200 ease-in-out hover:scale-110 hover:text-emerald-500"
            />
          </Link>

          {/* Start New Trip */}
          <Link
            href="/trips"
            className="flex-1 flex justify-center"
            aria-label="Go to Trips"
          >
            <LayoutDashboard
              className="w-6 h-6 text-emerald-700 transition-all duration-200 ease-in-out hover:scale-110 hover:text-emerald-500"
            />
          </Link>

          {/* Likes */}
          <Link
            href="/likes"
            className="flex-1 flex justify-center"
            aria-label="Go to Likes"
          >
            <Heart
              className="w-6 h-6 text-emerald-700 transition-all duration-200 ease-in-out hover:scale-110 hover:text-emerald-500"
            />
          </Link>

          {/* User Profile */}
          <button
            onClick={handleProfileClick}
            className="flex-1 flex justify-center"
            aria-label="Go to User Profile"
          >
            <UserProfileIcon
              className="w-8 h-8 text-emerald-700 transition-all duration-200 ease-in-out hover:scale-110 hover:text-emerald-500"
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Footer
