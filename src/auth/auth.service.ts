import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor( private readonly configService: ConfigService,    private readonly usersService: UsersService,

        private readonly jwtService: JwtService){}

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto
        
        const user = await this.usersService.findByUsername(username)
        if (!user) {
            throw new NotFoundException('Invalid credentials')
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload = { sub: user._id, email: user.email }
        
        return {access_token: this.jwtService.sign(payload), user:{id:user._id, email:user.email, username:user.username}}

    }
}
