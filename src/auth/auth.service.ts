import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    async signup(authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialDto);
        if(!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

        return { accessToken };
    }
}
