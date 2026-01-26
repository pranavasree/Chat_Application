import { Router } from "express";
import { searchContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddlleware.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);

export default contactRoutes;
