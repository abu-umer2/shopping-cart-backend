import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
){}
  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto
    
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser =  new this.userModel({
      username,
      email,
      password:hashedPassword
    })

    const savedUser = await newUser.save()

    const { password: _, ...result } = savedUser.toObject()
    return result
   
  }

  async findAll() {
    return await this.userModel.find()
  }

  async findOne(id: string) {
    return await this.userModel.findById({_id:id})
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate({_id:id}, updateUserDto,{new:true})
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete({_id:id})
  }

  findByUsername(username: string) {
    return this.userModel.findOne({username})
  }
}
