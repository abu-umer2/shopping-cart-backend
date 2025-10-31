import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Cart, CartDocument, CartItem  } from './entities/cart.entity';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { ProductsService } from '../products/products.service'; 
import { Product } from '../products/entities/product.entity'; 

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService, 
  ) {}

  async getOrCreateCart(userId: string): Promise<CartDocument> {
    let cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      // .populate({
      //   path: 'items.productId',
      //   model: 'Product', // Ensure this matches the 'ref' in CartItemSchema
      // })
      .exec();
    
    console.log('user',userId)

    if (!cart) {
      cart = new this.cartModel({
        userId: new Types.ObjectId(userId),
        items: [],
        totalPrice: 0,
      });
      await cart.save();
    }
    cart.lastAccessedAt = new Date();
    await cart.save(); 
    return cart;
  }

  async addItem(userId: string, addItemDto: AddItemToCartDto): Promise<CartDocument> {
    const { productId, quantity } = addItemDto;

    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    let newQuantityInCart = quantity; 

    if (existingItemIndex > -1) {
      newQuantityInCart = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantityInCart > product.stock) {
        throw new BadRequestException(
          `Cannot add ${quantity} units. Only ${product.stock - cart.items[existingItemIndex].quantity} more units of "${product.name}" available.`,
        );
      }
      cart.items[existingItemIndex].quantity = newQuantityInCart;
    } else {
      if (quantity > product.stock) {
        throw new BadRequestException(
          `Cannot add ${quantity} units. Only ${product.stock} units of "${product.name}" available.`,
        );
      }
      const newCartItem: CartItem = {
        productId: new Types.ObjectId(productId),
        productName: product.name,
        quantity,
        price: product.price, 
        imageFiles: product.image && product.image.length > 0 ? product.image[0] : undefined,
      };
      cart.items.push(newCartItem);
    }

    try {
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to add item to cart.');
    }
  }

  
  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(userId);

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex === -1) {
      throw new NotFoundException(`Product with ID "${productId}" not found in cart.`);
    }

    if (quantity === 0) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      const product = await this.productsService.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID "${productId}" no longer exists.`);
      }

      if (quantity > product.stock) {
        throw new BadRequestException(
          `Cannot update quantity to ${quantity}. Only ${product.stock} units of "${product.name}" available.`,
        );
      }
      cart.items[existingItemIndex].quantity = quantity;
    }

    try {
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update cart item quantity.');
    }
  }

 
  async removeItem(userId: string, productId: string): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(userId);
    const initialItemCount = cart.items.length;

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    cart.items.map(item=>{console.log('id', item.productId)})
  

    if (cart.items.length === initialItemCount) {
      throw new NotFoundException(`Product with ID "${productId}" not found in cart.`);
    }

    try {
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove item from cart.');
    }
  }


  async clearCart(userId: string): Promise<CartDocument> {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    cart.totalPrice = 0; 
    try {
      return await cart.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear cart.');
    }
  }


  async deleteCartByUserId(userId: string): Promise<CartDocument> {
    const deletedCart = await this.cartModel.findOneAndDelete({ userId: new Types.ObjectId(userId) }).exec();
    if (!deletedCart) {
      throw new NotFoundException(`Cart for user ID "${userId}" not found.`);
    }
    return deletedCart;
  }
}