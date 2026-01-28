import { Router } from "express";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddlleware.js";
import multer from "multer";

const messagesRoutes = Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/files/" });

messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile,
);

export default messagesRoutes;
