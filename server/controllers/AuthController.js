import { compare } from "bcrypt";
import { User } from "../models/UserModel.js";

import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

const signup = async (request, response) => {
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

const login = async (request, response) => {
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

export { signup, login };
