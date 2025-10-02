"use client";

import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // adjust path to your store
// import { fetchProfile } from "@/redux//thunk/userThunk";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchProfile } from "@/redux/thunk/userThunk";
interface UserProfileIconProps {
  className?: string;
}


const UserProfileIcon = ({className}:UserProfileIconProps)=> {
  const dispatch = useDispatch<AppDispatch>();
   const { user} = useSelector((state: RootState) => state.user);
const effectRan = useRef(false);
  // ✅ Fetch profile if not already loaded
  // useEffect(() => {
  //     if (!effectRan.current) { 
  //     dispatch(fetchProfile());
  //     effectRan.current = true;
  // }
  // }, [dispatch]);
  // useEffect(() => {
  
  //   if (!user?.id) {
  //     dispatch(fetchProfile());
  //   }
  // }, [user?.id, dispatch]);
// useEffect(() => {
//     if (!user?.id) {
//       dispatch(fetchProfile());
//     }
//   }, [user?.id, dispatch]);
// useEffect(() => {
//     if (effectRan.current) return;
//     if (!user?.id) {
//       dispatch(fetchProfile());
//     }
//     effectRan.current = true;
//   }, [dispatch, user?.id]);

  return (
   
//     <Avatar>
//       <AvatarImage
//   src={user?.profilePic ?? undefined}
//   alt={user?.name || "User"}
// />
//       <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
//     </Avatar>
<Avatar className={`w-8 h-8 border border-emerald-200 transition-all duration-200 ease-in-out ${className}`}>
      <AvatarImage
        src={user?.profilePic ?? undefined}
        alt={user?.name || "User"}
        className="object-cover"
      />
      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
        {user?.name?.[0] || "?"}
      </AvatarFallback>
    </Avatar>
 
  );
};

export default UserProfileIcon;
