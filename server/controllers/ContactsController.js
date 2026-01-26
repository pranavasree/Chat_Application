import { User } from "../models/UserModel.js";

export const searchContacts = async (request, response) => {
  try {
    const { searchTerm } = request.body;
    if (!searchTerm) {
      return response.status(400).send("Search term is required");
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g,
      "\\$&",
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
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

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return response.status(500).send("Internal Server Error");
  }
};
