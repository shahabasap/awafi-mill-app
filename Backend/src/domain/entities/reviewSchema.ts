// src/domain/entities/reviewSchema.ts

import mongoose, { Document } from "mongoose";

// Review interface
export interface IReview extends Document {
  user: string | mongoose.Types.ObjectId;
  product: string | mongoose.Types.ObjectId;
  order: string | mongoose.Types.ObjectId;  // Added order field to the interface
  rating: number;
  comment?: string;
  status: "pending" | "approved" | "declined";
}
