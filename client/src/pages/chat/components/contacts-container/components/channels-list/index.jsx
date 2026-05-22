import { useAppStore } from "@/store";
import { useEffect } from "react";
import apiClient from "@/lib/api-client";
import { GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const ChannelsList = () => {
  const {
    channels,
    setChannels,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getChannels = async () => {
      try {
        const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (response.data.channels) {
          // Remove duplicates based on channel _id
          const uniqueChannels = response.data.channels.reduce(
            (acc, channel) => {
              if (!acc.find((c) => c._id === channel._id)) {
                acc.push(channel);
              }
              return acc;
            },
            [],
          );

          console.log(
            "📋 Loaded channels:",
            uniqueChannels.length,
            uniqueChannels,
          );
          setChannels(uniqueChannels);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    getChannels();
  }, [setChannels]);

  const handleChannelClick = (channel) => {
    setSelectedChatType("channel");
    setSelectedChatData(channel);
    setSelectedChatMessages([]);
  };

  return (
    <div className="mt-4">
      {channels.map((channel) => (
        <div
          key={channel._id}
          onClick={() => handleChannelClick(channel)}
          className="flex items-center gap-3 p-3 hover:bg-[#2a2b33] cursor-pointer transition-all duration-300 rounded-lg"
        >
          <div
            className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getColor(channel.color || 0)}`}
          >
            #
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-white text-sm md:text-base font-medium truncate">
                {channel.name}
              </span>
            </div>
            {channel.description && (
              <p className="text-gray-400 text-xs truncate">
                {channel.description}
              </p>
            )}
            <p className="text-gray-500 text-xs">
              {channel.members.length} members
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelsList;
