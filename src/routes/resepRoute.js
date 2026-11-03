import express from "express";
import {
  getAllResep,
  getResepById,
  createResep,
  updateResep,
  deleteResep,
} from "../controllers/resepControl.js";

const router = express.Router();

router.get("/resep", getAllResep);
router.get("/resep/:id", getResepById);
router.post("/resep", createResep);
router.put("/resep/:id", updateResep);
router.delete("/resep/:id", deleteResep);

export default router;
