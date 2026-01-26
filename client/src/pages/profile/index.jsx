import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import apiClient from "@/lib/api-client";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { colors, getColor } from "@/lib/utils";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
  REMOVE_PROFILE_IMAGE_ROUTE,
  HOST,
} from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo?.color || 0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo?.profileSetup) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color || 0);
    }
    if (userInfo?.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          {
            firstName,
            lastName,
            image: userInfo?.image || "",
            color: selectedColor,
          },
          { withCredentials: true },
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully!");
          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile first");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profile-image", file);
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          {
            withCredentials: true,
          },
        );

        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          setImage(`${HOST}/${response.data.image}`);
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
        toast.success("Image removed successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <div className="flex flex-col gap-8 w-[90vw] md:w-[600px] lg:w-[700px] bg-[#1e1e2e]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <IoArrowBack
            className="text-3xl lg:text-4xl text-white/80 hover:text-white cursor-pointer transition-all hover:scale-110"
            onClick={handleNavigate}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Complete Your Profile
          </h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6">
          <div
            className="relative group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className={`h-32 w-32 md:h-40 md:w-40 rounded-full flex items-center justify-center transition-all duration-300 ${getColor(
                selectedColor,
              )} ${hovered ? "scale-105" : ""}`}
            >
              {image ? (
                <Avatar className="h-full w-full rounded-full overflow-hidden">
                  <AvatarImage
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </Avatar>
              ) : (
                <div className="uppercase text-5xl md:text-6xl font-bold">
                  {firstName
                    ? firstName.charAt(0)
                    : userInfo?.email.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Hover overlay */}
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 rounded-full backdrop-blur-sm transition-all duration-300">
                {image ? (
                  <FaTrash
                    className="text-white text-2xl cursor-pointer hover:text-red-500 transition-colors"
                    onClick={handleDeleteImage}
                  />
                ) : (
                  <FaPlus
                    className="text-white text-3xl cursor-pointer hover:scale-110 transition-transform"
                    onClick={handleFileInputClick}
                  />
                )}
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />

          <p className="text-white/60 text-sm">
            {image ? "Hover to remove image" : "Hover to add profile picture"}
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm font-medium">
                First Name
              </label>
              <Input
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#2a2a3e] border-white/20 text-white placeholder:text-white/40 focus:border-[#4cc9f0] focus:ring-[#4cc9f0]/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/80 text-sm font-medium">
                Last Name
              </label>
              <Input
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#2a2a3e] border-white/20 text-white placeholder:text-white/40 focus:border-[#4cc9f0] focus:ring-[#4cc9f0]/20"
              />
            </div>
          </div>

          {/* Email Display */}
          <div className="flex flex-col gap-2">
            <label className="text-white/80 text-sm font-medium">Email</label>
            <Input
              value={userInfo?.email || ""}
              disabled
              className="bg-[#2a2a3e]/50 border-white/10 text-white/60 cursor-not-allowed"
            />
          </div>

          {/* Color Picker */}
          <div className="flex flex-col gap-3">
            <label className="text-white/80 text-sm font-medium">
              Choose Avatar Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`h-10 w-10 rounded-full cursor-pointer transition-all duration-300 ${color} ${
                    selectedColor === index
                      ? "ring-4 ring-white/50 scale-110"
                      : "hover:scale-105"
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveChanges}
          className="w-full bg-gradient-to-r from-[#4cc9f0] to-[#4361ee] hover:from-[#4361ee] hover:to-[#4cc9f0] text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;
