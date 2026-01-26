import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true },
      );
      if (response.status === 200) {
        setUserInfo(undefined);
        navigate("/auth");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="h-14 md:h-16 flex items-center justify-between px-3 md:px-5 w-full bg-[#2a2b33] border-t border-[#2f303b]">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <div className="relative shrink-0">
          {userInfo?.image ? (
            <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </Avatar>
          ) : (
            <div
              className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-base md:text-lg font-semibold uppercase ${getColor(userInfo?.color || 0)}`}
            >
              {userInfo?.firstName
                ? userInfo.firstName.charAt(0)
                : userInfo?.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-white text-xs md:text-sm font-medium truncate">
            {userInfo?.firstName && userInfo?.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}`
              : userInfo?.email}
          </p>
          <p className="text-gray-400 text-[10px] md:text-xs truncate">
            {userInfo?.profileSetup ? "Online" : "Setup your profile"}
          </p>
        </div>
      </div>
      <div className="flex gap-1 md:gap-2 shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleEditProfile}
                className="text-gray-400 hover:text-purple-400 transition-colors p-1.5 md:p-2 rounded-md hover:bg-[#1b1c24]"
              >
                <FiEdit2 className="text-base md:text-xl" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors p-1.5 md:p-2 rounded-md hover:bg-[#1b1c24]"
              >
                <IoPowerSharp className="text-base md:text-xl" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
