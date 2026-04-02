import express from "express";
import {
    createIssue,
    getAllIssues,
    updateIssueStatus,
} from "../controller/issue.controller.js";
import authUser from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// User routes
router.post("/create", authUser, createIssue);

// Admin routes
router.get("/admin/all", authAdmin, getAllIssues);
router.post("/admin/status", authAdmin, updateIssueStatus);

export default router;
