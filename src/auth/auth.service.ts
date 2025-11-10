import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { AdminsService } from 'src/admins/admins.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/entities/user.entity';
import { CreateUserDto } from './dto/Signup.dto';
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument> , private readonly configService: ConfigService,    private readonly usersService: UsersService,
        private readonly adminsService: AdminsService,

        private readonly jwtService: JwtService){}

    async AdminLogin(loginDto: LoginDto) {
        const { username, password } = loginDto
        
        const admin = await this.adminsService.findByAdminname(username)
        if (!admin) {
            throw new NotFoundException('Invalid credentials')
        }

        const isValidPassword = await bcrypt.compare(password, admin.password)
        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { sub: admin._id, email: admin.email }
        
        return {access_token: this.jwtService.sign(payload), user:{id:admin._id, email:admin.email, username:admin.username}}

    }
    async signUp(createUserDto: CreateUserDto) {

        const existingUser = await this.usersService.findByUsername(createUserDto.username)
  if (existingUser) {
    throw new ConflictException('User with this username already exists.');
  }
        
  try {
   
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });



    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error('Error during signup:', error);
          throw new InternalServerErrorException('Failed to create user.');
        }
      }
     
      
    
      
      async login(
        loginDto: LoginDto,
      ): Promise<{ accessToken: string; user: Partial<User> }> {
        const { username, password } = loginDto;
    
        const user = await this.usersService.findByUsername(username)
        if (!user) {
          throw new UnauthorizedException('Invalid credentials'); 
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const payload = {
          userId: user._id, 
          email: user.email,
        };
    
        const accessToken = this.jwtService.sign(payload);
    
        // const { password: _, ...result } = user;
        return { accessToken, user };
      }
    
    
  async validateUser(userId: string): Promise<Partial<User>> {
        
        const user = await this.usersService.findById(userId);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        const { password: _, ...result } = user;
        return result;
      }
}
