import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext.jsx";
import apiClient from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { toast } from "sonner";

const MessageBar = () => {
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = () => {
    if (selectedChatType === "contact" && selectedChatData) {
      // Send file if uploaded
      if (uploadedFile) {
        socket.emit("sendMessage", {
          content: null,
          sender: userInfo.id,
          recipient: selectedChatData._id,
          messageType: "file",
          fileUrl: uploadedFile.filePath,
        });
        setUploadedFile(null);
        toast.success("File sent successfully!");
      }
      // Send text message if there's text
      else if (message.trim()) {
        socket.emit("sendMessage", {
          content: message,
          sender: userInfo.id,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: null,
        });
        setMessage("");
      }
    }
  };

  const handleAddEmoji = (emojiObject) => {
    console.log("Emoji clicked:", emojiObject);
    setMessage((msg) => msg + emojiObject.emoji);
  };

  const handleAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data.filePath) {
        // Store uploaded file info instead of sending immediately
        setUploadedFile({
          filePath: response.data.filePath,
          fileName: file.name,
        });
        toast.success("File uploaded! Click send to share.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEmojiToggle = () => {
    console.log("Emoji button clicked! Current state:", emojiPickerOpen);
    setEmojiPickerOpen((prev) => !prev);
  };

  return (
    <div className="bg-[#1c1d25] px-3 md:px-8 mb-3 md:mb-6">
      {/* File Preview */}
      {uploadedFile && (
        <div className="mb-2 flex items-center gap-2 bg-[#2a2b33] p-2 rounded-md">
          <div className="flex-1 flex items-center gap-2">
            <GrAttachment className="text-purple-400" />
            <span className="text-white text-xs md:text-sm truncate">
              {uploadedFile.fileName}
            </span>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-red-400 hover:text-red-300 text-xs md:text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
      />

      <div className="flex justify-center items-center gap-2 md:gap-6">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-2 md:gap-5 pr-2 md:pr-5">
          <input
            type="text"
            className="flex-1 p-3 md:p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-white text-sm md:text-base"
            placeholder={
              uploadedFile ? "File ready to send..." : "Enter Message"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={uploadedFile !== null}
          />
          <button
            type="button"
            onClick={handleAttachment}
            disabled={isUploading || uploadedFile !== null}
            className={`text-neutral-500 hover:text-white focus:border-none focus:outline-none duration-300 transition-all ${
              isUploading || uploadedFile ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <GrAttachment className="text-xl md:text-2xl" />
            )}
          </button>
          <div className="relative" ref={emojiRef}>
            <button
              type="button"
              className="text-neutral-500 hover:text-white focus:border-none focus:outline-none duration-300 transition-all"
              onClick={handleEmojiToggle}
            >
              <RiEmojiStickerLine className="text-xl md:text-2xl" />
            </button>
            {emojiPickerOpen && (
              <div className="absolute bottom-12 md:bottom-16 right-0 z-50">
                <EmojiPicker
                  theme="dark"
                  onEmojiClick={handleAddEmoji}
                  autoFocusSearch={false}
                  width={280}
                  height={350}
                />
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          className="bg-[#8417ff] rounded-md flex items-center justify-center p-3 md:p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all shrink-0"
          onClick={handleSendMessage}
          disabled={!message.trim() && !uploadedFile}
        >
          <IoSend className="text-xl md:text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default MessageBar;
