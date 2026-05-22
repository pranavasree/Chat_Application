import { Router } from "express";
import {
  login,
  signup,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
  getAllUsers,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/profiles/" });

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage,
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

authRoutes.post("/logout", verifyToken, logout);

// Debug endpoint to view all users
authRoutes.get("/all-users", getAllUsers);

export default authRoutes;
