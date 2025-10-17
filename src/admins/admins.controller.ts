import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminsService.create(createAdminDto);
  }

  @Get()
  async findAll() {
    return await this.adminsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return await this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adminsService.remove(id);
  }
}
