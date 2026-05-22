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
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  SEARCH_CONTACTS_ROUTE,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import MultipleSelector from "@/components/ui/multipleselect";

const CreateChannel = () => {
  const { setChannels } = useAppStore();
  const [openCreateChannelModal, setOpenCreateChannelModal] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        console.log("🔍 Fetching all users for channel creation...");
        // Fetch all users from the system
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm: "" }, // Empty search to get all users
          { withCredentials: true },
        );

        console.log("📦 API Response:", response);
        console.log("📦 Response data:", response.data);

        if (response.data.contacts) {
          const formattedContacts = response.data.contacts.map((contact) => ({
            value: contact._id,
            label: `${contact.firstName} ${contact.lastName}`,
          }));

          setAllContacts(formattedContacts);
          console.log(
            "📋 Loaded contacts for channel creation:",
            formattedContacts.length,
            formattedContacts,
          );
        } else {
          console.log("⚠️ No contacts in response");
        }
      } catch (error) {
        console.error("❌ Error fetching contacts:", error);
        console.error("Error details:", error.response);
        toast.error("Failed to load contacts");
      }
    };

    if (openCreateChannelModal) {
      getData();
    }
  }, [openCreateChannelModal]);

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      toast.error("Channel name is required");
      return;
    }

    if (selectedContacts.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        {
          name: channelName,
          description: channelDescription,
          members: selectedContacts.map((contact) => contact.value),
        },
        { withCredentials: true },
      );

      if (response.status === 201) {
        toast.success("Channel created successfully!");

        // Refetch all channels instead of adding manually to avoid duplicates
        const channelsResponse = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (channelsResponse.data.channels) {
          setChannels(channelsResponse.data.channels);
        }

        setOpenCreateChannelModal(false);
        setChannelName("");
        setChannelDescription("");
        setSelectedContacts([]);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error(error.response?.data || "Failed to create channel");
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setOpenCreateChannelModal(true)}
              className="text-neutral-400 hover:text-white transition-all duration-300 text-opacity-90 text-start font-light hover:text-sm"
            >
              <FaPlus className="text-sm" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white p-3">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={openCreateChannelModal}
        onOpenChange={setOpenCreateChannelModal}
      >
        <DialogContent
          className="bg-[#181920] border-[#2f303b] text-white w-[95vw] max-w-[450px] h-auto max-h-[90vh] flex flex-col"
          onKeyDown={(e) => {
            // Prevent Enter key from submitting or navigating
            if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Create New Channel
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Add members to start a group conversation
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1">
            <Input
              placeholder="Channel Name"
              className="bg-[#2a2b33] border-[#2f303b] text-white"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />

            <Input
              placeholder="Channel Description (optional)"
              className="bg-[#2a2b33] border-[#2f303b] text-white"
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Add Members
              </label>
              <MultipleSelector
                defaultOptions={allContacts}
                placeholder="Search contacts..."
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator="No contacts found"
              />
            </div>
          </div>

          <Button
            className="bg-[#8417ff] hover:bg-[#741bda] text-white"
            onClick={handleCreateChannel}
          >
            Create Channel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
