import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import {
  HOST,
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES_ROUTE,
} from "@/utils/constants";
import { useRef, useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import moment from "moment";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFile,
} from "react-icons/fa";
import ImageViewerModal from "@/components/ui/image-viewer-modal";

// Helper function to get file icon based on file extension
const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return <FaFileImage className="text-2xl md:text-3xl" />;
  } else if (["mp4", "avi", "mov", "wmv", "mkv"].includes(extension)) {
    return <FaFileVideo className="text-2xl md:text-3xl" />;
  } else if (["mp3", "wav", "ogg", "m4a"].includes(extension)) {
    return <FaFileAudio className="text-2xl md:text-3xl" />;
  } else if (extension === "pdf") {
    return <FaFilePdf className="text-2xl md:text-3xl" />;
  } else if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return <MdFolderZip className="text-2xl md:text-3xl" />;
  } else {
    return <FaFile className="text-2xl md:text-3xl" />;
  }
};

// Helper function to check if file is an image
const isImageFile = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
};

// Component for image with blur-to-clear loading effect
const BlurImage = ({ src, alt, onClick, onDownload }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  console.log("🖼️ BlurImage rendering with src:", src);

  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-[#8417ff] max-w-[250px] md:max-w-[350px] min-h-[150px]"
      onClick={onClick}
    >
      {!imageError ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto object-cover transition-all duration-700 ${loaded ? "blur-0 opacity-100" : "blur-md opacity-60"}`}
            style={{ display: "block" }}
            onLoad={() => {
              console.log("✅ Image loaded successfully:", src);
              setLoaded(true);
            }}
            onError={(e) => {
              console.error("❌ Failed to load image:", src);
              console.error("Error details:", e);
              setImageError(true);
            }}
          />
          {/* Hover overlay with download button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#8417ff] hover:bg-[#741bda] p-3 rounded-full shadow-lg transform group-hover:scale-110"
            >
              <IoMdArrowRoundDown className="text-2xl text-white" />
            </button>
          </div>
          {/* Loading overlay with spinner and blurred preview */}
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/30 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#8417ff] border-t-transparent"></div>
              <p className="text-xs text-white font-medium">Loading image...</p>
            </div>
          )}
        </>
      ) : (
        <div className="min-h-[150px] bg-[#2a2b33] flex flex-col items-center justify-center gap-2 p-6">
          <p className="text-red-400 text-sm">Failed to load image</p>
          <p className="text-gray-500 text-xs">{src.split("/").pop()}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300 underline"
          >
            Try downloading
          </button>
        </div>
      )}
    </div>
  );
};

const MessageContainer = () => {
  const scrollRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    userInfo,
    setSelectedChatMessages,
  } = useAppStore();

  // Download file function
  const downloadFile = async (fileUrl) => {
    try {
      const response = await fetch(`${HOST}/${fileUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Open image in modal
  const openImageViewer = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageViewerOpen(true);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch Direct Messages
        if (selectedChatType === "contact" && selectedChatData) {
          console.log(
            "📥 Fetching messages for contact:",
            selectedChatData._id,
          );
          const response = await apiClient.post(
            GET_ALL_MESSAGES_ROUTE,
            {
              userId: selectedChatData._id,
            },
            { withCredentials: true },
          );
          console.log("📥 Messages response:", response.data);
          if (response.status === 200 && response.data.messages) {
            setSelectedChatMessages(response.data.messages);
            console.log("✅ Messages loaded:", response.data.messages.length);
          }
        }
        // Fetch Channel Messages
        else if (selectedChatType === "channel" && selectedChatData) {
          console.log(
            "📥 Fetching messages for channel:",
            selectedChatData._id,
            "Full channel data:",
            selectedChatData,
          );
          const response = await apiClient.get(
            `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
            { withCredentials: true },
          );
          console.log("📥 Channel messages response:", response);
          console.log("📥 Response data:", response.data);
          if (response.status === 200 && response.data.messages) {
            setSelectedChatMessages(response.data.messages);
            console.log(
              "✅ Channel messages loaded:",
              response.data.messages.length,
              response.data.messages,
            );
          } else {
            console.log("⚠️ No messages in response or wrong status");
            setSelectedChatMessages([]);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      }
    };

    if (selectedChatData) {
      fetchMessages();
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      // Format date for display
      const displayDate = moment(message.timestamp).calendar(null, {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "dddd",
        sameElse: "MMMM DD, YYYY",
      });

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center my-2">
              <span className="text-gray-500 bg-[#1c1d25] px-4 py-1 rounded-full text-xs">
                {displayDate}
              </span>
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    // Check if the current user is the sender
    const isCurrentUserSender = message.sender._id
      ? message.sender._id === userInfo.id
      : message.sender === userInfo.id;

    return (
      <div className={`${isCurrentUserSender ? "text-right" : "text-left"}`}>
        {isCurrentUserSender ? (
          <MessageSent
            message={message.content}
            time={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            messageType={message.messageType}
            fileUrl={message.fileUrl}
            openImageViewer={openImageViewer}
            downloadFile={downloadFile}
          />
        ) : (
          <MessageReceived
            message={message.content}
            time={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            contact={selectedChatData}
            messageType={message.messageType}
            fileUrl={message.fileUrl}
            openImageViewer={openImageViewer}
            downloadFile={downloadFile}
          />
        )}
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    // Check if the current user is the sender
    const isCurrentUserSender = message.sender._id
      ? message.sender._id === userInfo.id
      : message.sender === userInfo.id;

    return (
      <div className={`${isCurrentUserSender ? "text-right" : "text-left"}`}>
        {isCurrentUserSender ? (
          <MessageSent
            message={message.content}
            time={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            messageType={message.messageType}
            fileUrl={message.fileUrl}
            openImageViewer={openImageViewer}
            downloadFile={downloadFile}
          />
        ) : (
          <MessageReceived
            message={message.content}
            time={new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            contact={message.sender}
            messageType={message.messageType}
            fileUrl={message.fileUrl}
            openImageViewer={openImageViewer}
            downloadFile={downloadFile}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full scrollbar-hidden">
        <div className="space-y-4">
          {renderMessages()}
          <div ref={scrollRef} />
        </div>
      </div>

      <ImageViewerModal
        isOpen={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        imageUrl={selectedImage}
      />
    </>
  );
};

const MessageReceived = ({
  message,
  time,
  contact,
  messageType,
  fileUrl,
  openImageViewer,
  downloadFile,
}) => {
  console.log("📨 MessageReceived:", {
    messageType,
    fileUrl,
    isImage: fileUrl && isImageFile(fileUrl),
  });

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
        {messageType === "file" && fileUrl ? (
          <>
            {isImageFile(fileUrl) ? (
              <BlurImage
                src={`${HOST}/${fileUrl}`}
                alt="Image"
                onClick={() => openImageViewer(fileUrl)}
                onDownload={() => downloadFile(fileUrl)}
              />
            ) : (
              <div className="bg-[#2a2b33] text-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tl-none max-w-[280px] md:max-w-[350px]">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-[#3a3b43] p-2 rounded-lg transition-colors"
                  onClick={() => downloadFile(fileUrl)}
                >
                  <div className="text-purple-400 text-3xl">
                    {getFileIcon(fileUrl)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate">
                      {fileUrl.split("/").pop()}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400">
                      {(Math.random() * 10).toFixed(2)} MB
                    </p>
                  </div>
                  <IoMdArrowRoundDown className="text-2xl text-purple-400" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#2a2b33] text-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tl-none">
            <p className="text-xs md:text-sm break-words">{message}</p>
          </div>
        )}
        <span className="text-[10px] md:text-xs text-gray-500 px-2">
          {time}
        </span>
      </div>
    </div>
  );
};

const MessageSent = ({
  message,
  time,
  messageType,
  fileUrl,
  openImageViewer,
  downloadFile,
}) => {
  return (
    <div className="flex items-start gap-2 md:gap-3 max-w-[85%] md:max-w-[70%] ml-auto flex-row-reverse">
      <div className="flex flex-col gap-1 items-end">
        {messageType === "file" && fileUrl ? (
          <>
            {isImageFile(fileUrl) ? (
              <BlurImage
                src={`${HOST}/${fileUrl}`}
                alt="Image"
                onClick={() => openImageViewer(fileUrl)}
                onDownload={() => downloadFile(fileUrl)}
              />
            ) : (
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tr-none max-w-[280px] md:max-w-[350px]">
                <div
                  className="flex items-center gap-3 cursor-pointer hover:bg-purple-600 hover:bg-opacity-50 p-2 rounded-lg transition-colors"
                  onClick={() => downloadFile(fileUrl)}
                >
                  <div className="text-white text-3xl">
                    {getFileIcon(fileUrl)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium truncate">
                      {fileUrl.split("/").pop()}
                    </p>
                    <p className="text-[10px] md:text-xs text-purple-100">
                      {(Math.random() * 10).toFixed(2)} MB
                    </p>
                  </div>
                  <IoMdArrowRoundDown className="text-2xl text-white" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tr-none">
            <p className="text-xs md:text-sm break-words">{message}</p>
          </div>
        )}
        <span className="text-[10px] md:text-xs text-gray-500 px-2">
          {time}
        </span>
      </div>
    </div>
  );
};

export default MessageContainer;
