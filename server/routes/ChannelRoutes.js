import { Router } from "express";
import {
  createChannel,
  getUserChannels,
  getChannelMessages,
} from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddlleware.js";

const channelRoutes = Router();

channelRoutes.post("/create", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default channelRoutes;
