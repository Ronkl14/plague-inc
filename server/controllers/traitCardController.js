import asyncHandler from "express-async-handler";
import TraitCard from "../model/TraitCard.js";

export const createNewTraitCard = asyncHandler(async (req, res, next) => {
  const card = await TraitCard.create(req.body);

  res.status(200).json({
    success: true,
    data: card,
  });
});

export const getTraitCard = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const card = await TraitCard.find({ cardID: id });

  res.status(200).json({
    success: true,
    data: card,
  });
});
