import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

import apiClient from "@/lib/api-client";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utils/constants";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUserInfo } = useAppStore();

  const validateLogin = () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(
          LOGIN_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true },
        );
        console.log(response.data);
        toast.success("Login successful!");
        if (response.data.user.id) {
          setUserInfo(response.data.user);
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          toast.error(error.response.data || "Login failed");
        } else {
          toast.error("Network error. Please try again.");
        }
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          {
            email,
            password,
          },
          { withCredentials: true },
        );
        console.log(response.data);
        toast.success("Account created successfully!");
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          toast.error(error.response.data || "Signup failed");
        } else {
          toast.error("Network error. Please try again.");
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#1c1d25]">
      <div className="h-[90vh] bg-[#181920] border border-[#2f303b] shadow-2xl w-[95vw] md:w-[85vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl grid lg:grid-cols-2 overflow-hidden">
        {/* Left Side - Form */}
        <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={Victory} alt="Whispr Logo" className="h-12 w-12" />
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Whispr
                </h1>
              </div>
              <p className="text-gray-400 text-sm md:text-base">
                Connect with friends and the world around you
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#2a2b33] p-1 rounded-lg border border-[#2f303b]">
                <TabsTrigger
                  value="login"
                  className="rounded-md data-[state=active]:bg-[#8417ff] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 font-medium transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-md data-[state=active]:bg-[#8417ff] data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-400 font-medium transition-all"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex flex-col gap-4 mt-6" value="login">
                <div className="space-y-4">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="h-12 px-4 bg-[#2a2b33] border-[#2f303b] text-white placeholder:text-gray-500 focus:bg-[#1c1d25] focus:border-[#8417ff] focus:ring-1 focus:ring-[#8417ff] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="h-12 px-4 bg-[#2a2b33] border-[#2f303b] text-white placeholder:text-gray-500 focus:bg-[#1c1d25] focus:border-[#8417ff] focus:ring-1 focus:ring-[#8417ff] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="h-12 mt-2 bg-[#8417ff] text-white hover:bg-[#741bda] transition-all duration-200 font-medium shadow-lg"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-4 mt-6" value="signup">
                <div className="space-y-4">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="h-12 px-4 bg-[#2a2b33] border-[#2f303b] text-white placeholder:text-gray-500 focus:bg-[#1c1d25] focus:border-[#8417ff] focus:ring-1 focus:ring-[#8417ff] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="h-12 px-4 bg-[#2a2b33] border-[#2f303b] text-white placeholder:text-gray-500 focus:bg-[#1c1d25] focus:border-[#8417ff] focus:ring-1 focus:ring-[#8417ff] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="h-12 px-4 bg-[#2a2b33] border-[#2f303b] text-white placeholder:text-gray-500 focus:bg-[#1c1d25] focus:border-[#8417ff] focus:ring-1 focus:ring-[#8417ff] transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="h-12 mt-2 bg-[#8417ff] text-white hover:bg-[#741bda] transition-all duration-200 font-medium shadow-lg"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Side - Background Image with Overlay */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#8417ff] to-[#5a0fc7] relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <img
            src={Background}
            alt="Background"
            className="h-full w-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white z-10">
            <img
              src={Victory}
              alt="Whispr"
              className="h-32 w-32 mb-6 drop-shadow-2xl"
            />
            <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
              Welcome to Whispr
            </h2>
            <p className="text-xl text-center max-w-md text-gray-100 drop-shadow-md">
              Experience seamless messaging with end-to-end encryption and
              real-time communication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
