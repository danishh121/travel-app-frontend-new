"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from '@/redux/store'
import { updateUserProfile } from "@/redux/thunk/userThunk";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export default function EditProfileForm() {
const dispatch = useDispatch<AppDispatch>();
const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    location: {
      continent: "",
      country: "",
      state: "",
      city: "",
      area: "",
      lat: 0,
      lng: 0,
    },
  });
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully ✅");
    // router.push("/login"); // redirect to login page
  };

  
  // ✅ Autofill location
  const autofillLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          setFormData((prev) => ({
            ...prev,
            location: {
              continent: data?.address?.continent || "",
              country: data?.address?.country || "",
              state: data?.address?.state || "",
              city:
                data?.address?.city ||
                data?.address?.town ||
                data?.address?.village ||
                "",
              area: data?.address?.suburb || "",
              lat: latitude,
              lng: longitude,
            },
          }));
          toast.success("📍 Location detected automatically!");
        } catch (err) {
          toast.error("Failed to detect location ❌");
        }
      });
    } else {
      toast.error("Geolocation not supported ❌");
    }
  };

  useEffect(() => {
    autofillLocation(); // auto-detect when page loads
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: field === "lat" || field === "lng" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully ✅");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile ❌");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 shadow-lg">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} />
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>

        {/* Location fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="continent">Continent</Label>
            <Input id="continent" name="location.continent" value={formData.location.continent} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="location.country" value={formData.location.country} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" name="location.state" value={formData.location.state} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="location.city" value={formData.location.city} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="area">Area</Label>
            <Input id="area" name="location.area" value={formData.location.area} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" name="location.lat" type="number" value={formData.location.lat} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input id="lng" name="location.lng" type="number" value={formData.location.lng} onChange={handleChange} />
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Save Profile
        </Button>
      {/* 🚀 Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full mt-3"
        >
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
