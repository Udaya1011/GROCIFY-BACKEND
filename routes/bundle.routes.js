import express from "express";
import { getBundles } from "../controller/bundle.controller.js";

const bundleRouter = express.Router();

bundleRouter.get("/list", getBundles);

export default bundleRouter;
