import { Injectable, BadRequestException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt} from 'crypto'

import { promisify } from "util";

const scrypt = promisify(_scrypt)

import { UsersService } from "./users.service";

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signup(email: string, password: string) {
        // See if email is in use
        const users = await this.userService.find(email)
        if(users.length) {
            return new BadRequestException('Emain in use')
        }

        /// Hash the users password
        // Generate salt
        const salt = randomBytes(8).toString('hex')
        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer
        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex')

        // Create a new user and save it

        // return the user
    }

    signin() {}
}