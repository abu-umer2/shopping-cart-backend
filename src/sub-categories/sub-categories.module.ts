import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './entities/sub-category.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports:[ MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
    ]), CategoriesModule],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
  exports:[SubCategoriesService]
})
export class SubCategoriesModule {}
