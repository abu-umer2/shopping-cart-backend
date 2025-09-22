import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { SubCategoriesService } from 'src/sub-categories/sub-categories.service';
import { Category, CategoryDocument } from 'src/categories/entities/category.entity';
import { SubCategory, SubCategoryDocument } from 'src/sub-categories/entities/sub-category.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,
  @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>,
    private readonly categoryService: CategoriesService,
    private readonly SubCategoryService: SubCategoriesService,

  ) { }
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryModel.findById(createProductDto.categoriesId)
    if (!category) {
      throw new NotFoundException('category not found')
    }
    let subCategory: any = null; 
    if (createProductDto.subCategoriesId) {
      subCategory = await this.subCategoryModel.findById(createProductDto.subCategoriesId);
      if (!subCategory) {
        throw new NotFoundException('SubCategory not found');
      }
    }

    const product = await this.productModel.create(createProductDto)
    await this.categoryModel.findByIdAndUpdate(
      createProductDto.categoriesId,
      { $push: { productsId: product._id } },
      { new: true }
    );
  
    await this.subCategoryModel.findByIdAndUpdate(
      createProductDto.subCategoriesId,
      { $push: { productsId: product._id } },
      { new: true }
    );
    console.log('Products from DB:', product);
    return product
  }

  async findAll() {
      const products = await this.productModel
        .find()
        .populate('categoriesId')
        .populate('subCategoriesId');
    
        console.log("Populated products:", JSON.stringify(products, null, 2));
        return products;
    }
  

  async findOne(id: string) {
    return await this.productModel.findById(id).populate('categoriesId')
    .populate('subCategoriesId');
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.productModel.findOneAndUpdate({ _id: id }, updateProductDto, { new: true });
  }

  async remove(id: string) {
    return await this.productModel.findOneAndDelete({_id:id})
  }
}
