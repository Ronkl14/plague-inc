import asyncHandler from "express-async-handler";
import CountryCard from "../model/CountryCard.js";

export const createNewCountryCard = asyncHandler(async (req, res, next) => {
  const card = await CountryCard.create(req.body);

  res.status(200).json({
    success: true,
    data: card,
  });
});

export const getCountryCard = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const card = await CountryCard.find({ cardID: id });

  res.status(200).json({
    success: true,
    data: card,
  });
});
