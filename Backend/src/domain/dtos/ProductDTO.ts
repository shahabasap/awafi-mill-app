// src/domain/dto/product.dto.ts

import mongoose from "mongoose";

interface Description {
  header: string;
  content: string;
}

export interface Variant {
  weight: string;
  inPrice: number;
  outPrice: number;
  stockQuantity: number;
}

// Define the Product interface


export interface ProductDTO {
  _id:unknown
  name: string;
  descriptions: Description[];
  category:mongoose.Types.ObjectId | null;
  subCategory:mongoose.Types.ObjectId | null;
  images: string[];
  variants: Variant[];
  isListed:boolean;
  sku:string;
  ean:string;
  inCart?:boolean;
  inWishlist?:boolean;
  MainCategoryData?:any;
  SubCategoryData?:any;
  averageRating?:number
  totalReviews?:number
}
export interface ProductCreationDTO {
  name: string;
  descriptions: Description[];
  isListed: boolean;
  category:mongoose.Types.ObjectId | null;
  subCategory:mongoose.Types.ObjectId | null;
  images: string[];
  variants: Variant[];
  sku:string;
  ean:string
}
