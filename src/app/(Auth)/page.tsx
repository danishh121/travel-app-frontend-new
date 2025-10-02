

"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { requestOtp, verifyOtp } from "@/redux/thunk/authThunk";
import { setPhone, setOtp } from "@/redux/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { isValidPhone } from "@/lib/utils";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { phone, otp, step, loading, error, message, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // ✅ Prevent double submit
  const hasSubmitted = useRef(false);

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !hasSubmitted.current) {
      toast.success("Login successful!");
      // router.replace("/"); 
      hasSubmitted.current = true;// avoid back button loop
    }
  }, [isAuthenticated, router]);

  // ✅ Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid 10-digit phone number starting with 6-9");
      return;
    }
    if (!hasSubmitted.current) {
      dispatch(requestOtp(phone));
      hasSubmitted.current = true;
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSubmitted.current) {
      dispatch(verifyOtp({ phone, otp }));
      hasSubmitted.current = true;
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 px-4">
      <Toaster position="top-center" />
      <Card className="w-full max-w-sm pt-12 pb-12 shadow-lg rounded-2xl border bg-green-100">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Image src="/globe.svg" alt="Logo" width={48} height={48} />
          </div>
          <CardTitle className="text-green-600 text-4xl font-bold">Sign in</CardTitle>
          <CardDescription className="text-gray-600 mt-3">
            Welcome to <span className="font-bold text-green-600 text-l">Traveler </span>
            Your Next Great Story Starts Here.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "phone" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  className="bg-white"
                  type="text"
                  value={phone}
                  onChange={(e) => dispatch(setPhone(e.target.value))}
                  placeholder="Enter phone"
                  required
                />
              </div>
              <Button type="submit" className="w-full mt-3 bg-[#03774f] hover:bg-[#008858]" disabled={loading}>
                {loading ? "Sending OTP..." : "Request OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium mt-3 text-gray-700">Enter OTP</label>
                <InputOTP
                  className="w-fit flex items-center justify-center"
                  maxLength={6}
                  value={otp}
                  onChange={(val) => dispatch(setOtp(val))}
                >
                  <InputOTPGroup className="w-full flex justify-between gap-2 mt-5">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i}  />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full bg-[#03774f] hover:bg-[#008858]" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {message && <div className="text-green-600 mt-2 text-center text-sm">{message}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;