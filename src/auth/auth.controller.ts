import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/Signup.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('admin/login')
  @ApiResponse({ status: 200, description: 'User successfully logged in.', type: 'login completed'})
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
async AdminLogin(@Body() loginDto: LoginDto ) {
  return this.authService.AdminLogin(loginDto);
}
  
   @Post('signup')
   @ApiResponse({ status: 201, description: 'User successfully registered.' })
   @ApiResponse({ status: 400, description: 'Invalid input or email already exists.' })
   async signUp(@Body() body: any) {
    if (body.shippingAddresses && typeof body.shippingAddresses === 'string') {
      body.shippingAddresses = JSON.parse(body.shippingAddresses);
    }
      return this.authService.signUp(body as CreateUserDto);
    }
  
  
    @Post('login')
    @ApiResponse({ status: 200, description: 'User successfully logged in.', type: 'login completed'})
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
}
