import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      console.log("🔌 Initializing socket connection for user:", userInfo.id);
      const newSocket = io(HOST, {
        query: { userId: userInfo.id },
        withCredentials: true,
      });
      socket.current = newSocket;

      socket.current.on("connect", () => {
        console.log(
          "✅ Socket connected successfully! Socket ID:",
          socket.current.id,
        );
      });

      socket.current.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error.message);
      });

      socket.current.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected. Reason:", reason);
      });

      const handleReceiveMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }
      };

      const handleReceiveChannelMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType === "channel" &&
          selectedChatData &&
          selectedChatData._id === message.channelId
        ) {
          console.log("📨 Received channel message:", message);
          addMessage(message);
        }
      };

      const handleMessageDeleted = ({ messageId, deletedForEveryone }) => {
        const { removeMessage } = useAppStore.getState();
        console.log("🗑️ Message deleted:", messageId, deletedForEveryone);
        removeMessage(messageId);
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleReceiveChannelMessage);
      socket.current.on("message-deleted", handleMessageDeleted);

      return () => {
        if (socket.current) {
          console.log("🔌 Cleaning up socket connection");
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
