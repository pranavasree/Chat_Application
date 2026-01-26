import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { selectedChatData, selectedChatType, closeChat } = useAppStore();

  return (
    <div className="h-[10vh] min-h-[60px] border-b-2 border-[#2f303b] flex items-center justify-between px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <div className="relative shrink-0">
          {selectedChatData?.image ? (
            <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
              <AvatarImage
                src={`${HOST}/${selectedChatData.image}`}
                alt="Profile"
                className="object-cover w-full h-full bg-black"
              />
            </Avatar>
          ) : (
            <div
              className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-white font-semibold text-base md:text-lg ${getColor(selectedChatData?.color || 0)}`}
            >
              {selectedChatData?.firstName
                ? selectedChatData.firstName.charAt(0).toUpperCase()
                : selectedChatData?.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white text-sm md:text-lg font-semibold truncate">
            {selectedChatType === "contact" &&
            selectedChatData?.firstName &&
            selectedChatData?.lastName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData?.email}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm truncate">
            {selectedChatData?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all hover:text-white"
          onClick={closeChat}
        >
          <RiCloseFill className="text-2xl md:text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
