import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UpdateProductDto } from './dto/update-product.dto';
import { diskStorage } from 'multer';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'imageFiles', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/products',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; imageFiles?: Express.Multer.File[] },
    @Body() createProductDto: CreateProductDto,
  ) {
    if (files.image && files.image[0]) {
      createProductDto.image = files.image[0].filename;
    }

    if (files.imageFiles && files.imageFiles.length > 0) {
      createProductDto.imageFiles = files.imageFiles.map((f) => f.filename);
    }

    return this.productsService.create(createProductDto);
  }
  @Get()
  findAll() {
    return this.productsService.findAll()
  }

  @Get('search')
  async search(@Query('query') query: string) {
    console.log('query1', query)
    if (!query || query.trim() === "") return [];
    return await this.productsService.searchProduct(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }



  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'imageFiles', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/products',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; imageFiles?: Express.Multer.File[] },
    @Body() updateProductDto: UpdateProductDto,
  ) {
    if (files.image && files.image[0]) {
      updateProductDto.image = files.image[0].filename;
    }

    if (files.imageFiles && files.imageFiles.length > 0) {
      updateProductDto.imageFiles = files.imageFiles.map((f) => f.filename);
    }

    return this.productsService.update(id, updateProductDto);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  @Get('sub/:subId')
  async getProductsBySub(@Param('subId') subId: string) {
    return this.productsService.getProductsBySub(subId);
  }

}


