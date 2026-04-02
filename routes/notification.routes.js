import express from "express";
import { getNotifications, markAsRead } from "../controller/notification.controller.js";
import authUser from "../middlewares/authUser.js";

const notificationRouter = express.Router();

notificationRouter.get("/list", authUser, getNotifications);
notificationRouter.post("/read", authUser, markAsRead);

export default notificationRouter;
