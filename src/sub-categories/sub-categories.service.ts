import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategory, SubCategoryDocument } from './entities/sub-category.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class SubCategoriesService {
   constructor(
  
     @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategoryDocument>,
     private readonly categoriesService: CategoriesService,
    ) {}
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const { name, isActive, categoryId } = createSubCategoryDto
    
    const subCategoryExist = await this.subCategoryModel.findOne({ name })
    if (subCategoryExist) {
      throw new BadRequestException('subCategory already exist')
    }
    const category = await this.categoriesService.findOne(categoryId)
    if (!category) {
  throw new NotFoundException('category does not exist')
}
const newSubCategory = await this.subCategoryModel.create({
  name,
  isActive,
  categoryId,
});

await this.categoriesService.addSubCategory(categoryId, newSubCategory._id);

return newSubCategory;  }

  findAll() {
    return this.subCategoryModel.find()
  }

  findOne(id: string) {
    return `This action returns a #${id} subCategory`;
  }

  update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }

  async getSubcategoriesByCategory(categoryId: string) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error('Invalid category ID');
    }

    const subCategories = await this.subCategoryModel
      .find({ categoryId: categoryId })

    return subCategories;
  }

}
