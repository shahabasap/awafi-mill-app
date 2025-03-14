import { IWishlistReturnDTO, WishlistDTO } from "../../domain/dtos/WishlistDTO";
import { Model, isValidObjectId, Types } from "mongoose"; // Import Types for ObjectId
import { IWishlist } from "../../domain/entities/wishlistSchema";
import { BaseRepository } from "./baseRepository";
import IWishlistRepo from "../../interface/wishlistInterface/IwishlistRepo";
import { ProductModel } from "../model/producModel";
import { ReviewModel } from "../model/reviewModel";

// Wishlist repository extending the base repository and implementing IWishlistRepo
export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepo {
  constructor(model: Model<IWishlist>) {
    super(model);
  }

  private async getOrCreateWishlist(userId: string): Promise<IWishlist> {
    const wishlist = await this.model.findOne({ user: userId }).exec();
    if (!wishlist) {
      return await this.createWishlist({ userId, items: [] });
    }
    return wishlist;
  }

  private validateObjectId(id: string, type: string): void {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid ${type} ID`);
    }
  }

  async createWishlist(data: WishlistDTO): Promise<IWishlist> {
    try {
      const wishlistEntity = { user: data.userId, items: data.items };
      return await super.create(wishlistEntity);
    } catch (error) {
      console.error(`Error creating wishlist for user ${data.userId}: ${error.message}`);
      throw new Error(`Error creating wishlist: ${error.message}`);
    }
  }

  async findWishlistByUser(userId: string): Promise<IWishlistReturnDTO | null> {
    try {
      this.validateObjectId(userId, 'User');

      const wishlist = await this.model.findOne({ user: userId });
      if (!wishlist) {
        //DEBUG
        //@ts-ignore
        return this.getOrCreateWishlist(userId);
      }

      const productDetailsList = [];

      for (const item of wishlist.items) {
        const { productId, variantId } = item;

        const productDetails = await ProductModel.findOne(
          {
            _id: productId,
            "variants._id": variantId
          },
          {
            "name": 1,
            "variants.$": 1,
            "images": 1
          }
        );

        if (productDetails) {
          const productData = {
            productId: productDetails._id,
            variantId: productDetails.variants[0]._id,
            name: productDetails.name,
            weight: productDetails.variants[0].weight,
            inPrice: productDetails.variants[0].inPrice,
            outPrice: productDetails.variants[0].outPrice,
            images: productDetails.images[0],
            stockQuantity: productDetails.variants[0].stockQuantity,
            rating: 0
          };


          productDetailsList.push(productData);
        }
      }


      for (const item of productDetailsList) {

        const reviews = await ReviewModel.find({ product: item.productId });


        if (reviews.length > 0) {
          const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
          item.rating = totalRating / reviews.length; // Calculate average rating
        } else {
          item.rating = 0;
        }
      }


      // console.log("wishlist: ", productDetailsList);
      // console.log("productDetailsList: ", productDetailsList);
      //DEBUG
      //@ts-ignore
      return productDetailsList;
    } catch (error) {
      console.error(`Error finding wishlist with product details for user ${userId}: ${error.message}`);
      throw new Error(`Error finding wishlist with product details: ${error.message}`);
    }
  }





  async addItemToWishlist(userId: string, productId: string, variantId: string): Promise<IWishlist> {
    try {
      this.validateObjectId(userId, 'User');
      this.validateObjectId(productId, 'Product');

      // Convert to ObjectId
      const productObjectId = new Types.ObjectId(productId);

      const variantObjectId = new Types.ObjectId(variantId);


      const wishlist = await this.getOrCreateWishlist(userId);

      // Check if the item with the specific variant already exists
      const existingItem = wishlist.items.find(item =>
        item.productId.equals(productObjectId) && item.variantId.equals(variantObjectId) // Use equals for ObjectId comparison
      );


      if (existingItem) {
        console.warn(`Item with variant ${variantId} already exists in wishlist for user ${userId}`);
        throw new Error('Item with this variant already exists in the wishlist');
      }

      const newItem = { productId: productObjectId, variantId: variantObjectId }; // Store as ObjectId

      return await this.model.findOneAndUpdate(
        { user: userId },
        { $addToSet: { items: newItem } },
        { new: true, upsert: true }
      ).exec();
    } catch (error) {
      console.error(`Error adding item to wishlist for user ${userId}: ${error.message}`);
      throw new Error(`Error adding item to wishlist: ${error.message}`);
    }
  }

  async removeItemFromWishlist(userId: string, productId: string, variantId: string): Promise<IWishlist | null> {
    try {
      this.validateObjectId(userId, 'User');
      this.validateObjectId(productId, 'Product');

      // Convert to ObjectId
      const productObjectId = new Types.ObjectId(productId);
      const variantObjectId = new Types.ObjectId(variantId);

      return await this.model.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { productId: productObjectId, variantId: variantObjectId } } },
        { new: true }
      ).exec();
    } catch (error) {
      console.error(`Error removing item from wishlist for user ${userId}: ${error.message}`);
      throw new Error(`Error removing item from wishlist: ${error.message}`);
    }
  }

  async deleteWishlist(userId: string): Promise<IWishlist | null> {
    try {
      this.validateObjectId(userId, 'User');
      return await this.model.findOneAndDelete({ user: userId }).exec();
    } catch (error) {
      console.error(`Error deleting wishlist for user ${userId}: ${error.message}`);
      throw new Error(`Error deleting wishlist: ${error.message}`);
    }
  }
}