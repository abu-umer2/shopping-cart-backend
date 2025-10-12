import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model, Types } from 'mongoose';
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
    const {categoriesId, subCategoriesId, ...rest} = createProductDto
    console.log('cat',createProductDto)
    const category = await this.categoryModel.findById(categoriesId)
    if (!category) {
      throw new NotFoundException('category not found')
    }

    
    let subCategory: any = null; 
    if (subCategoriesId) {
      subCategory = await this.subCategoryModel.findById(subCategoriesId);
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
  
    if (createProductDto.subCategoriesId) {
      await this.subCategoryModel.findByIdAndUpdate(
        createProductDto.subCategoriesId,
        { $push: { productsId: product._id } },
        { new: true }
      );
    }
    return product
  }

  async findAll() {
      const products = await this.productModel
        .find()
        .populate('categoriesId', 'name')     
        .populate('subCategoriesId', 'name')   
        .exec();  
        return products;
    }
  

  async findOne(id: string) {
    return await this.productModel.findById(id)
  }
  async getProductsBySub(id: string) {
    console.log("Subcategory ID:", id);
  
    const products = await this.productModel.find({
      subCategoriesId: id
    }).exec();
  
    return products;
  }

 
  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
  
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProductWithName = await this.productModel.findOne({ name: updateProductDto.name }).exec();
      if (existingProductWithName && (existingProductWithName._id as Types.ObjectId).toString() !== id) {
        throw new ConflictException('Product with this name already exists.');
      }
    }
  
    Object.assign(product, updateProductDto);
    console.log('pro', product)
  
    try {
      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product.');
    }
  }
  async remove(id: string) {
    return await this.productModel.findOneAndDelete({_id:id})
  }
}
