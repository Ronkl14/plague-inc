import express from "express";
import { createNewCard } from "../controllers/traitCardController.js";

const router = express.Router();

router.route("/traits").post(createNewCard);

export default router;
