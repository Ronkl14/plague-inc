import asyncHandler from "express-async-handler";
import TraitCard from "../model/TraitCard.js";

export const createNewCard = asyncHandler(async (req, res, next) => {
  const card = await TraitCard.create(req.body);

  res.status(200).json({
    success: true,
    data: card,
  });
});
