
"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login"); // navigate to /login
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-50 p-2 sm:p-4  overflow-hidden">
      <Card className="w-fit m-14 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-[10px] bg-green-100 shadow-lg ">
        {/* Top main image */}
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]">
          <Image
            src="/background.jpg" // place in public folder
            alt="Travel Background"
            fill
            priority
            className="object-cover"
          />
          {/* Gradient overlay fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 lg:h-28 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* Polaroid-style stacked images */}
        <CardContent className="flex justify-center -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16 mb-4 sm:mb-6 relative z-10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Image
              src="/img-1.jpg"
              alt="Trip Memory 1"
              width={80}
              height={80}
              className="rounded-lg shadow-md rotate-[-8deg] w-20 sm:w-24 md:w-28"
            />
            <Image
              src="/img-2.jpg"
              alt="Trip Memory 2"
              width={80}
              height={80}
              className="rounded-lg shadow-md w-20 sm:w-24 md:w-28"
            />
            <Image
              src="/img-3.jpg"
              alt="Trip Memory 3"
              width={80}
              height={80}
              className="rounded-lg shadow-md rotate-[8deg] w-20 sm:w-24 md:w-28"
            />
          </div>
        </CardContent>

        {/* Heading & Description */}
        <CardHeader className="px-4 sm:px-6 text-center pb-0">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight sm:leading-snug">
            Capture, Track & Relive <br className="hidden sm:block" /> Your Trips Effortlessly
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-2 sm:mt-3">
            From planning to memories, keep your travel story alive.
          </p>
        </CardHeader>

        {/* Button */}
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            onClick={handleClick}
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-2 sm:py-3 md:py-4 rounded-full shadow-md transition"
          >
            Let&apos;s Go
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
