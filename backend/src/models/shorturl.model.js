// TypeScript with Mongoose
import { Mongoose, Schema, model } from "mongoose";

const shortURLSchema = new Schema(
  {
    originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String 
  },
  userId:{
    type:Schema.Types.ObjectId
  },
  expiresAt: {
    type: Date,
  },
    clickCount: { type: Number, default: 0 },
  
  isDeleted :{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true }
);

export const ShortURL = model("shortURL", shortURLSchema);
