import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { SignUpDto } from './dto/Signup.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';


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
    async signUp(@Body() signUpDto: SignUpDto) {
      return this.authService.signUp(signUpDto);
    }
  
  
    @Post('login')
    @ApiResponse({ status: 200, description: 'User successfully logged in.', type: 'login completed'})
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
}
