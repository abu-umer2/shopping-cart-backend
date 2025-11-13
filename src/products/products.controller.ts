import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UpdateProductDto } from './dto/update-product.dto';
import { diskStorage } from 'multer';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: 'image', maxCount: 1 },
  //       { name: 'imageFiles', maxCount: 5 },
  //     ], {
  //     storage: diskStorage({
  //       destination: './uploads/products',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File,) {
  //   createProductDto.image = file ? file.filename : '';

  //   return this.productsService.create(createProductDto);
  // }
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
    // ✅ Handle single image
    if (files.image && files.image[0]) {
      createProductDto.image = files.image[0].filename;
    }

    // ✅ Handle multiple images
    if (files.imageFiles && files.imageFiles.length > 0) {
      createProductDto.imageFiles = files.imageFiles.map((f) => f.filename);
    }

    return this.productsService.create(createProductDto);
  }
  @Get()
  findAll() {
    return this.productsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  // @UseInterceptors(
  //   FilesInterceptor('images', 5, {
  //     storage: diskStorage({
  //       destination: './uploads/products',
  //       filename: (req, file, callback) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  //       },
  //     }),
  //   }),
  // )
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateProductDto: UpdateProductDto,
  //   @UploadedFiles() files?: Express.Multer.File[],
  // ) {
  //   if (files && files.length > 0) {
  //     updateProductDto.imageFiles = files.map((file) => file.filename);

  //     updateProductDto.image = files[0].filename;
  //   }

  //   return this.productsService.update(id, updateProductDto);
  // }

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


