import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";

import React from "react";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login");
  };

  const handleSignup = async () => {
    console.log("Signup");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="h-[90vh] bg-white shadow-xl w-[95vw] md:w-[85vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl grid lg:grid-cols-2 overflow-hidden">
        {/* Left Side - Form */}
        <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Sign in to continue to your account
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="login"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium transition-all"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent className="flex flex-col gap-4 mt-6" value="login">
                <div className="space-y-4">
                  <Input
                    placeholder="Email"
                    type="email"
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="h-12 mt-2 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 font-medium"
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
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="h-12 mt-2 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 font-medium"
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div className="hidden lg:flex items-center justify-center bg-gray-900 relative overflow-hidden">
          <img
            src={Background}
            alt="Background"
            className="h-full w-full object-cover opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
