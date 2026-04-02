import express from "express";
import { createReminder, checkReminders } from "../controller/reminder.controller.js";
import authUser from "../middlewares/authUser.js";

const reminderRouter = express.Router();

reminderRouter.post("/create", authUser, createReminder);
reminderRouter.get("/check", authUser, checkReminders);

export default reminderRouter;
