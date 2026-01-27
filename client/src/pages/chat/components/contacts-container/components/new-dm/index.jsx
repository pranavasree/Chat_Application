import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie-json";
import apiClient from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchContacts = async (value) => {
    setSearchTerm(value);
    try {
      if (value.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          {
            searchTerm: value,
          },
          { withCredentials: true },
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
      setSearchedContacts([]);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSearchedContacts([]);
    setSearchTerm("");
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    console.log("Selected contact:", contact);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Dialog
              open={openNewContactModal}
              onOpenChange={setOpenNewContactModal}
            >
              <DialogTrigger asChild>
                <button className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300">
                  <FaPlus className="text-sm" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#181920] border-none text-white w-[95vw] max-w-[400px] h-[90vh] max-h-[500px] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Please select a contact</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div>
                  <Input
                    placeholder="Search Contacts"
                    className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none text-white"
                    onChange={(e) => searchContacts(e.target.value)}
                  />
                </div>
                {searchedContacts.length > 0 && (
                  <ScrollArea className="flex-1 max-h-[300px]">
                    <div className="flex flex-col gap-2 md:gap-3 pr-2 md:pr-4">
                      {searchedContacts.map((contact) => (
                        <div
                          key={contact._id}
                          className="flex gap-2 md:gap-3 items-center cursor-pointer hover:bg-[#2c2e3b] p-2 md:p-3 rounded-lg transition-all"
                          onClick={() => selectNewContact(contact)}
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 relative shrink-0">
                            {contact.image ? (
                              <Avatar className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden">
                                <AvatarImage
                                  src={`${HOST}/${contact.image}`}
                                  alt="Profile"
                                  className="object-cover w-full h-full bg-black rounded-full"
                                />
                              </Avatar>
                            ) : (
                              <div
                                className={`uppercase h-10 w-10 md:h-12 md:w-12 text-base md:text-lg border flex items-center justify-center rounded-full ${getColor(contact.color)}`}
                              >
                                {contact.firstName
                                  ? contact.firstName.charAt(0)
                                  : contact.email.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm md:text-base truncate">
                              {contact.firstName && contact.lastName
                                ? `${contact.firstName} ${contact.lastName}`
                                : contact.email}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              {contact.email}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {searchedContacts.length === 0 && !searchTerm && (
                  <div className="flex-1 flex flex-col justify-center items-center mt-5 px-4">
                    <Lottie
                      animationData={animationData}
                      loop={true}
                      autoplay={true}
                      className="w-20 h-20 md:w-24 md:h-24"
                    />
                    <div className="text-opacity-80 text-white flex flex-col gap-3 md:gap-5 items-center mt-3 md:mt-5 text-base md:text-xl lg:text-2xl transition-all duration-300 text-center">
                      <h3 className="poppins-medium">
                        Hi<span className="text-purple-500">!</span> Search new
                        <span className="text-purple-500"> Contact.</span>
                      </h3>
                    </div>
                  </div>
                )}

                {searchedContacts.length === 0 && searchTerm && (
                  <div className="flex-1 flex flex-col justify-center items-center mt-5 px-4">
                    <div className="text-opacity-80 text-white flex flex-col gap-3 md:gap-5 items-center text-base md:text-lg lg:text-xl transition-all duration-300 text-center">
                      <h3 className="poppins-medium text-gray-400">
                        No contacts found
                      </h3>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default NewDM;
