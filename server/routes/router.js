import express from "express";
import {
  createNewTraitCard,
  getTraitCard,
} from "../controllers/traitCardController.js";
import {
  createNewCountryCard,
  getCountryCard,
} from "../controllers/countryCardController.js";

const router = express.Router();

router.route("/traits").post(createNewTraitCard);
router.route("/traits/:id").get(getTraitCard);
router.route("/countries").post(createNewCountryCard);
router.route("/countries/:id").get(getCountryCard);

export default router;
