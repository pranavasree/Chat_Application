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
