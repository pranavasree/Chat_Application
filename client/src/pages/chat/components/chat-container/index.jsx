import MessageContainer from "./components/message-container";
import MessageBar from "./components/message-bar";
import ChatHeader from "./components/chat-header";

const ChatContainer = () => {
  return (
    <div className="h-full w-full bg-[#1c1d25] flex flex-col">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
