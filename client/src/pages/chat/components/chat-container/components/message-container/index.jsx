import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import { useRef, useEffect } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages } =
    useAppStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center my-2">
              <span className="text-gray-500 bg-[#1c1d25] px-4 py-1 rounded-full text-xs">
                {messageDate}
              </span>
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isSender = message.sender === selectedChatData._id;

    return (
      <div className={`${isSender ? "text-left" : "text-right"}`}>
        {isSender ? (
          <MessageReceived
            message={message.content}
            time={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            contact={selectedChatData}
          />
        ) : (
          <MessageSent
            message={message.content}
            time={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full scrollbar-hidden">
      <div className="space-y-4">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

const MessageReceived = ({ message, time, contact }) => {
  return (
    <div className="flex items-start gap-2 md:gap-3 max-w-[85%] md:max-w-[70%]">
      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full shrink-0">
        {contact?.image ? (
          <Avatar className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden">
            <AvatarImage
              src={`${HOST}/${contact.image}`}
              alt="Profile"
              className="object-cover w-full h-full bg-black"
            />
          </Avatar>
        ) : (
          <div
            className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm ${getColor(contact?.color || 0)}`}
          >
            {contact?.firstName
              ? contact.firstName.charAt(0).toUpperCase()
              : contact?.email?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-[#2a2b33] text-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tl-none">
          <p className="text-xs md:text-sm break-words">{message}</p>
        </div>
        <span className="text-[10px] md:text-xs text-gray-500 px-2">
          {time}
        </span>
      </div>
    </div>
  );
};

const MessageSent = ({ message, time }) => {
  return (
    <div className="flex items-start gap-2 md:gap-3 max-w-[85%] md:max-w-[70%] ml-auto flex-row-reverse">
      <div className="flex flex-col gap-1 items-end">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tr-none">
          <p className="text-xs md:text-sm break-words">{message}</p>
        </div>
        <span className="text-[10px] md:text-xs text-gray-500 px-2">
          {time}
        </span>
      </div>
    </div>
  );
};

export default MessageContainer;
