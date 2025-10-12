import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(

    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, isActive } = createCategoryDto
    const CategoryExist = await this.categoryModel.findOne({ name })
    if (CategoryExist) {
      throw new BadRequestException('category already exist')
    }

    return await this.categoryModel.create(createCategoryDto)
  }

  async findAll() {
    return await this.categoryModel.find().populate('subCategories',"name").exec();
  }

  async findOne(id: string) {
    return await this.categoryModel.findById(id).populate('subCategories').exec();
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryModel.findByIdAndUpdate(id,updateCategoryDto,{ new: true })
  }

  async remove(id: string) {
    return await this.categoryModel.findByIdAndDelete(id)
  }
  
async addSubCategory(categoryId: string, subCategoryId: Types.ObjectId) {
  return this.categoryModel.findByIdAndUpdate(
    categoryId,
    { $push: { subCategories: subCategoryId } },
    { new: true },
  );
}
  
  async findCategoryById(id: string) {
    return this.categoryModel.findByIdAndUpdate(id)
  }
}
