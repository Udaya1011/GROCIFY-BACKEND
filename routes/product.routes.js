import express from "express";

import { authAdmin } from "../middlewares/authAdmin.js";
import {
  addProduct,
  changeStock,
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post("/add-product", authAdmin, upload.array("image", 4), addProduct);
router.get("/list", getProducts);
router.get("/id", getProductById);
router.post("/stock", authAdmin, changeStock);
router.post("/delete", authAdmin, deleteProduct);
router.post("/update-product", authAdmin, upload.array("image", 4), updateProduct);

export default router;
