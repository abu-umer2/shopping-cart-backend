import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './entities/product.entity';
import { Model, Types, ObjectId } from 'mongoose';
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
    const { categoriesId, subCategoriesId, ...rest } = createProductDto;

    const category = await this.categoryModel.findById(categoriesId);
    if (!category) throw new NotFoundException('Category not found');

    let subCategory: any = null;
    if (subCategoriesId) {
      subCategory = await this.subCategoryModel.findById(subCategoriesId);
      if (!subCategory) throw new NotFoundException('SubCategory not found');
    }

    const product = await this.productModel.create({
      ...rest,
      categoriesId,
      subCategoriesId,
    });

    await this.categoryModel.findByIdAndUpdate(categoriesId.toString(), {
      $push: { productsId: product._id },
    });
    console.log('categoriesId', categoriesId)
    console.log('subCategoriesId', subCategoriesId)

    if (subCategoriesId) {
      await this.subCategoryModel.findByIdAndUpdate(subCategoriesId.toString(), {
        $push: { productsId: product._id },
      });
    }

    return product;
  }


  async findAll() {
    const products = await this.productModel
      .find()
      .populate('categoriesId', 'name')
      .populate('subCategoriesId', 'name')
      .exec();
    return products;
  }

  async searchProduct(query: string) {
    console.log('query', query)
    return await this.productModel.find({
      name: { $regex: query, $options: "i" }
    });
  }
  async findOne(id: string) {
    return await this.productModel.findById(id)
  }
  async getProductsBySub(id: string) {

    const products = await this.productModel.find({
      subCategoriesId: id
    }).exec();

    return products;
  }




  async update(id: string, updateProductDto: UpdateProductDto & { removeImages?: string[] }): Promise<ProductDocument> {
    console.log('updatre', updateProductDto)
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.productModel.findOne({ name: updateProductDto.name }).exec();
      if (existingProduct && existingProduct._id.toString() !== id) {
        throw new ConflictException('Product with this name already exists.');
      }
    }

    if (updateProductDto.image) {
      product.image = updateProductDto.image;
    }
    if (updateProductDto.imageFiles?.length) {
      product.imageFiles?.push(...updateProductDto.imageFiles);
    }

    if (updateProductDto.removeImages?.length) {
      product.imageFiles = product.imageFiles?.filter(img => !updateProductDto.removeImages!.includes(img));
    }

    // --- CATEGORY ---
    if (updateProductDto.categoriesId) {
      const newCategoryId = updateProductDto.categoriesId.toString();

      if (!product.categoriesId || product.categoriesId.toString() !== newCategoryId) {

        // Remove from old category
        if (product.categoriesId) {
          await this.categoryModel.findByIdAndUpdate(product.categoriesId.toString(), {
            $pull: { productsId: product._id },
          });
        }

        // Add to new category
        await this.categoryModel.findByIdAndUpdate(newCategoryId, {
          $addToSet: { productsId: product._id },
        });

        product.categoriesId = new Types.ObjectId(newCategoryId);
      }
    }

    // --- SUBCATEGORY ---
    if (updateProductDto.subCategoriesId) {
      const newSubCategoryId = updateProductDto.subCategoriesId.toString();

      if (!product.subCategoriesId || product.subCategoriesId.toString() !== newSubCategoryId) {
        // Remove from old subcategory
        if (product.subCategoriesId) {
          await this.subCategoryModel.findByIdAndUpdate(
            product.subCategoriesId.toString(),
            { $pull: { productsId: product._id } }
          );
        }

        // Add to new subcategory
        await this.subCategoryModel.findByIdAndUpdate(newSubCategoryId, {
          $addToSet: { productsId: product._id },
        });

        product.subCategoriesId = new Types.ObjectId(newSubCategoryId);
      }
    }




    const { image, imageFiles, removeImages, categoriesId, subCategoriesId, ...rest } = updateProductDto;
    Object.assign(product, rest);

    try {
      return await product.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update product.');
    }
  }

  async remove(id: string) {
    return await this.productModel.findOneAndDelete({ _id: id })
  }

  async findById(id: string) {
    return await this.productModel.findById(id)
  }
}
