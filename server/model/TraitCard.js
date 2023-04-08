import mongoose from "mongoose";

const TraitCardSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    cardID: Number,
    effects: [{ name: String, effect: Number }],
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

export default mongoose.model("TraitCard", TraitCardSchema);
