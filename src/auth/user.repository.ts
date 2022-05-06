import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signup(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
           await user.save();
        }catch(error) {
            if(error.code === '23505') { // duplicate username
                throw new ConflictException("Username already exists")
            }else {
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string>
    {
        return bcrypt.hash(password, salt);
    }

    async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string>
    {
        const { username, password } = authCredentialDto;
        const user = await this.findOne({username});
        console.log(user);
        if(user && await user.validatePassword(password)){
            return user.username;
        }else {
            return null;
        }
    }
}