import { Router } from "express";
import {
  searchContacts,
  getContactsForDMList,
} from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddlleware.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);

export default contactRoutes;
