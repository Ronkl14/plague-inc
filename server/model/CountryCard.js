import mongoose from "mongoose";

const CountryCardSchema = new mongoose.Schema(
  {
    name: String,
    continent: String,
    cities: Number,
    cardID: Number,
  },
  {
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model("CountryCard", CountryCardSchema);
