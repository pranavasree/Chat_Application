import { User } from "../models/UserModel.js";

import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (user) {
      return response.status(400).send("User already exists");
    }
    const newUser = await User.create({ email, password });
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
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export { signup };
