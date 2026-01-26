import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef(null);

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
    console.log("Send button clicked!");
    if (message.trim()) {
      console.log("Sending message:", message);
      // TODO: Send message to backend
      setMessage("");
    } else {
      console.log("Message is empty");
    }
  };

  const handleAddEmoji = (emojiObject) => {
    console.log("Emoji clicked:", emojiObject);
    setMessage((msg) => msg + emojiObject.emoji);
  };

  const handleAttachment = () => {
    console.log("Attachment button clicked!");
    // TODO: Open file picker
  };

  const handleEmojiToggle = () => {
    console.log("Emoji button clicked! Current state:", emojiPickerOpen);
    setEmojiPickerOpen((prev) => !prev);
  };

  return (
    <div className="h-[10vh] min-h-[60px] bg-[#1c1d25] flex justify-center items-center px-3 md:px-8 mb-3 md:mb-6 gap-2 md:gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-2 md:gap-5 pr-2 md:pr-5">
        <input
          type="text"
          className="flex-1 p-3 md:p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-white text-sm md:text-base"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAttachment}
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <GrAttachment className="text-xl md:text-2xl" />
        </button>
        <div className="relative" ref={emojiRef}>
          <button
            type="button"
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
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
      >
        <IoSend className="text-xl md:text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
