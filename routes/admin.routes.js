import express from "express";
import {
  checkAuth,
  adminLogin,
  adminLogout,
  getAllUsers,
  getAllSellers,
  approveSeller,
  blockSeller,
  registerDeliveryBoy,
  getAllDeliveryBoys,
  assignOrder,
} from "../controller/admin.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/is-auth", authAdmin, checkAuth);
router.get("/logout", authAdmin, adminLogout);
router.get("/users", authAdmin, getAllUsers);
router.get("/sellers", authAdmin, getAllSellers);
router.put("/sellers/:id/approve", authAdmin, approveSeller);
router.put("/sellers/:id/block", authAdmin, blockSeller);
router.post("/delivery/register", authAdmin, registerDeliveryBoy);
router.get("/delivery/list", authAdmin, getAllDeliveryBoys);
router.post("/order/assign", authAdmin, assignOrder);

export default router;
