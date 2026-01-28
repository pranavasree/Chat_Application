import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyChatContainer from "./components/empty-chat-container";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast.error("Please complete your profile before continuing");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen w-screen overflow-hidden text-white">
      {/* Contacts Container - Always visible on desktop, hidden on mobile when chat is open */}
      <div
        className={`${selectedChatType !== undefined ? "hidden md:block" : "block"} md:block`}
      >
        <ContactsContainer />
      </div>

      {/* Chat/Empty Container - Takes remaining space, hidden on mobile when no chat selected */}
      <div
        className={`${selectedChatType === undefined ? "hidden md:flex" : "flex"} flex-1`}
      >
        {selectedChatType === undefined ? (
          <EmptyChatContainer />
        ) : (
          <ChatContainer />
        )}
      </div>
    </div>
  );
};

export default Chat;
