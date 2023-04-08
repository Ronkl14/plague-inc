import express from "express";
import { createNewCard, getCard } from "../controllers/traitCardController.js";

const router = express.Router();

router.route("/traits").post(createNewCard);
router.route("/traits/:id").get(getCard);

export default router;
