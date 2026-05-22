import { User } from "../models/UserModel.js";

export const searchContacts = async (request, response) => {
  try {
    console.log("🔍 searchContacts called with body:", request.body);
    const { searchTerm } = request.body;

    let contacts;

    // If no search term, return all users except the current user
    if (!searchTerm || searchTerm.trim() === "") {
      console.log("📋 Empty search term - fetching all users");
      contacts = await User.find({
        _id: { $ne: request.userId },
      }).select("_id firstName lastName email image color");

      console.log(
        `📋 Returning all ${contacts.length} users for channel creation`,
      );
    } else {
      // Search with the provided term
      const sanitizedSearchTerm = searchTerm.replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        "\\$&",
      );

      const regex = new RegExp(sanitizedSearchTerm, "i");

      contacts = await User.find({
        $and: [
          { _id: { $ne: request.userId } },
          {
            $or: [
              { email: { $regex: regex } },
              { firstName: { $regex: regex } },
              { lastName: { $regex: regex } },
            ],
          },
        ],
      });

      console.log(
        `🔍 Search for "${searchTerm}" returned ${contacts.length} results`,
      );
    }

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getContactsForDMList = async (request, response) => {
  try {
    const userId = request.userId;

    // Import Message model
    const { Message } = await import("../models/MessagesModel.js");

    // Find all messages where the user is either sender or recipient
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate("sender", "_id firstName lastName email image color")
      .populate("recipient", "_id firstName lastName email image color")
      .sort({ timestamp: -1 });

    // Extract unique contacts
    const contactsMap = new Map();

    messages.forEach((message) => {
      // Skip messages without sender or recipient (e.g., channel messages)
      if (!message.sender || !message.recipient) {
        return;
      }

      const contactId =
        message.sender._id.toString() === userId
          ? message.recipient._id.toString()
          : message.sender._id.toString();

      const contact =
        message.sender._id.toString() === userId
          ? message.recipient
          : message.sender;

      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          _id: contact._id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          image: contact.image,
          color: contact.color,
          lastMessageTime: message.timestamp,
        });
      }
    });

    // Convert map to array and sort by last message time
    const contacts = Array.from(contactsMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime),
    );

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Get contacts for DM list error:", error);
    return response.status(500).send("Internal Server Error");
  }
};
