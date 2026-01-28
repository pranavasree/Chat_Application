import React from "react";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

const ContactList = ({ contacts, isChannel = false }) => {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="px-2 md:px-3">
        <div className="text-center text-gray-400 text-xs py-4">
          {isChannel ? "No channels yet" : "No conversations yet"}
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-3 space-y-1">
      {contacts.map((contact) => (
        <ContactItem
          key={contact._id}
          contact={contact}
          isChannel={isChannel}
        />
      ))}
    </div>
  );
};

const ContactItem = ({ contact, isChannel }) => {
  const { setSelectedChatType, setSelectedChatData, selectedChatData } =
    useAppStore();

  const handleClick = () => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);
  };

  const isSelected = selectedChatData?._id === contact._id;

  if (isChannel) {
    return (
      <div
        onClick={handleClick}
        className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all group ${
          isSelected ? "bg-[#2a2b33]" : ""
        }`}
      >
        <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-[#2a2b33] flex items-center justify-center text-purple-400 shrink-0">
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs md:text-sm font-medium truncate">
            #{contact.name}
          </p>
          <p className="text-gray-400 text-[10px] md:text-xs">
            {contact.members || 0} members
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-lg hover:bg-[#2a2b33] cursor-pointer transition-all group ${
        isSelected ? "bg-[#2a2b33]" : ""
      }`}
    >
      <div className="relative shrink-0">
        {contact.image ? (
          <Avatar className="h-9 w-9 md:h-10 md:w-10 rounded-full overflow-hidden">
            <AvatarImage
              src={`${HOST}/${contact.image}`}
              alt="Profile"
              className="object-cover w-full h-full bg-black"
            />
          </Avatar>
        ) : (
          <div
            className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getColor(contact.color || 0)}`}
          >
            {contact.firstName
              ? contact.firstName.charAt(0).toUpperCase()
              : contact.email.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs md:text-sm font-medium truncate">
          {contact.firstName && contact.lastName
            ? `${contact.firstName} ${contact.lastName}`
            : contact.email}
        </p>
        <p className="text-gray-400 text-[10px] md:text-xs truncate">
          {contact.email}
        </p>
      </div>
    </div>
  );
};

export default ContactList;
