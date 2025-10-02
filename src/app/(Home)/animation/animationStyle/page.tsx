
// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { animationStyles, animationMusic,createAnimation } from "@/redux/thunk/animationThunk";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";

// export default function AnimationStylesPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const tripId = searchParams.get("tripId");

//   const { styles, loading, error, music,animationId } = useSelector(
//     (state: RootState) => state.animation
//   );

//   const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
//   const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
//   const [creating, setCreating] = useState(false);
//   const photoIdsParam = searchParams.get("photos");
//   const selectedPhotos = photoIdsParam ? photoIdsParam.split(",") : [];

//   useEffect(() => {
//     dispatch(animationStyles());
//     dispatch(animationMusic());
//   }, [dispatch]);

//   // ✅ Handle Create Animation
//   const handleCreateAnimation = async () => {
//     if (!tripId || !selectedStyle || !selectedMusic || selectedPhotos.length === 0) return;

//     try {
//       setCreating(true);

//       const res = await dispatch(
//         createAnimation({
//           tripId,
//           title: "My Trip Animation", // You can also make this user input
//           styleId: selectedStyle,
//           musicId: selectedMusic,
//           photoIds: selectedPhotos,
//         })
//       ).unwrap();

//       // ✅ Once created, redirect to preview page with animationId
//       router.push(`/animation/preview?animationId=${res.animationId}`);
//     } catch (err) {
//       console.error("Animation creation failed:", err);
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-red-500 text-center">{error}</p>;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-green-50 px-2 sm:px-4">
//       <Card className="w-full max-w-xl mt-8 rounded-2xl shadow-lg bg-green-100 relative">
//         <CardHeader className="flex justify-between items-center">
//           <h1 className="text-xl font-bold">Choose an Animation Style</h1>
//           <h1 className="text-xl font-bold">Choose Music Track</h1>
//         </CardHeader>

//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Styles */}
//           <div>
//             {styles.map((style) => (
//               <div
//                 key={style.id}
//                 onClick={() => setSelectedStyle(style.id)}
//                 className={`border rounded-xl p-4 shadow cursor-pointer bg-white ${
//                   selectedStyle === style.id ? "border-blue-600" : ""
//                 }`}
//               >
//                 {style.thumbnail_url && (
//                   <img
//                     src={style.thumbnail_url}
//                     alt={style.name}
//                     className="w-full h-28 object-cover rounded-md mb-2"
//                   />
//                 )}
//                 <h3 className="font-semibold">{style.name}</h3>
//                 <p className="text-sm text-gray-600">{style.description}</p>
//               </div>
//             ))}
//           </div>

//           {/* Music */}
//           <div>
//             {music.map((track: any) => (
//               <div
//                 key={track.id}
//                 onClick={() => setSelectedMusic(track.id)}
//                 className={`border rounded-xl p-4 shadow cursor-pointer bg-white ${
//                   selectedMusic === track.id ? "border-blue-600" : ""
//                 }`}
//               >
//                 <h3 className="font-semibold">{track.title}</h3>
//                 <p className="text-sm text-gray-600">by {track.artist}</p>
//                 <p className="text-xs text-gray-500">
//                   Duration: {Math.floor(track.duration / 60)}:
//                   {(track.duration % 60).toString().padStart(2, "0")}
//                 </p>

//                 {/* Audio player */}
//                 <audio controls className="w-full mt-2">
//                   <source src={track.url} type="audio/mp3" />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             ))}
//           </div>
//         </CardContent>

//         {/* ✅ Proceed Button */}
//         <div className="p-6 flex justify-center">
//           <button
//             disabled={!selectedStyle || !selectedMusic || creating}
//             onClick={handleCreateAnimation}
//             className={`px-6 py-3 rounded-xl font-semibold ${
//               !selectedStyle || !selectedMusic
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-green-700 hover:bg-green-800 text-white"
//             }`}
//           >
//              {creating ? "Creating..." : "Create Animation"}
//           </button>
//         </div>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  animationStyles,
  animationMusic,
  createAnimation,
} from "@/redux/thunk/animationThunk";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function AnimationStylesContent() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tripId = searchParams.get("tripId");
  const photoIdsParam = searchParams.get("photos");
  const selectedPhotos = photoIdsParam ? photoIdsParam.split(",") : [];

  const { styles, loading, error, music } = useSelector(
    (state: RootState) => state.animation
  );

  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(animationStyles());
    dispatch(animationMusic());
  }, [dispatch]);

  // ✅ Handle Create Animation
  const handleCreateAnimation = async () => {
    if (!tripId || !selectedStyle || !selectedMusic || selectedPhotos.length === 0) return;

    try {
      setCreating(true);

      const res = await dispatch(
        createAnimation({
          tripId,
          title: "My Trip Animation",
          styleId: selectedStyle,
          musicId: selectedMusic,
          photoIds: selectedPhotos,
        })
      ).unwrap();

      router.push(`/animation/preview?animationId=${res.animationId}`);
      
    } catch (err) {
      console.error("Animation creation failed:", err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-2 sm:px-4">
      <Card className="w-full max-w-xl mt-8 rounded-2xl shadow-lg bg-green-100 relative">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Choose an Animation Style</h1>
          <h1 className="text-xl font-bold">Choose Music Track</h1>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Styles */}
          <div>
            {styles.map((style) => (
              <div
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`border rounded-xl p-4 shadow cursor-pointer bg-white ${
                  selectedStyle === style.id ? "border-blue-600" : ""
                }`}
              >
                {style.thumbnail_url && (
                  <img
                    src={style.thumbnail_url}
                    alt={style.name}
                    className="w-full h-28 object-cover rounded-md mb-2"
                  />
                )}
                <h3 className="font-semibold">{style.name}</h3>
                <p className="text-sm text-gray-600">{style.description}</p>
              </div>
            ))}
          </div>

          {/* Music */}
          <div>
            {music.map((track: any) => (
              <div
                key={track.id}
                onClick={() => setSelectedMusic(track.id)}
                className={`border rounded-xl p-4 shadow cursor-pointer bg-white ${
                  selectedMusic === track.id ? "border-blue-600" : ""
                }`}
              >
                <h3 className="font-semibold">{track.title}</h3>
                <p className="text-sm text-gray-600">by {track.artist}</p>
                <p className="text-xs text-gray-500">
                  Duration: {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, "0")}
                </p>
                <audio controls className="w-full mt-2">
                  <source src={track.url} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        </CardContent>

        {/* ✅ Proceed Button */}
        <div className="p-6 flex justify-center">
          <button
            disabled={!selectedStyle || !selectedMusic || creating}
            onClick={handleCreateAnimation}
            className={`px-6 py-3 rounded-xl font-semibold ${
              !selectedStyle || !selectedMusic
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {creating ? "Creating..." : "Create Animation"}
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function AnimationStylesPage() {
  return (
    <Suspense fallback={<p>Loading search params...</p>}>
      <AnimationStylesContent />
    </Suspense>
  );
}
