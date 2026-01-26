import { compare } from "bcrypt";
import { User } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).send("User already exists");
    }

    // Create new user
    const newUser = await User.create({ email, password });

    // Set JWT cookie
    response.cookie("jwt", createToken(newUser.email, newUser._id), {
      secure: true,
      maxAge,
      sameSite: "none",
    });

    return response.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        image: newUser.image,
        profileSetup: newUser.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return response.status(400).send("User already exists");
    }

    return response.status(500).send("Internal Server Error");
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).send("User not found");
    }

    // Compare password
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(401).send("Invalid credentials");
    }

    // Set JWT cookie
    response.cookie("jwt", createToken(user.email, user._id), {
      secure: true,
      maxAge,
      sameSite: "none",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        profileSetup: user.profileSetup,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User not found");
    }
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetup: userData.profileSetup,
      color: userData.color,
    });
  } catch (error) {
    console.error("Login error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response) => {
  try {
    const { userId } = request;
    const { firstName, lastName, image, color } = request.body;

    if (!firstName || !lastName || color === undefined) {
      return response
        .status(400)
        .send("First name, last name and color are required");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        image,
        color,
        profileSetup: true,
      },
      { new: true },
    );

    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetup: userData.profileSetup,
      color: userData.color,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true },
    );

    return response.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Add profile image error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send("User not found");
    }

    // Delete the file from the filesystem if it exists
    if (user.image) {
      try {
        unlinkSync(user.image);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    // Update user to remove image
    user.image = null;
    await user.save();

    return response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.error("Remove profile image error:", error);
    return response.status(500).send("Internal Server Error");
  }
};
