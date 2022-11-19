import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
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
            throw new BadRequestException('Emain in use')
        }

        /// Hash the users password
        // Generate salt
        const salt = randomBytes(8).toString('hex')
        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer
        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex')

        // Create a new user and save it
        const user = await this.userService.create(email, result)
        // return the user
        return user
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email)
        if(!user) {
            throw new NotFoundException('User not found')
        }

        const [salt, storedHash] = user.password.split('.')

        const hash = (await scrypt(password, salt, 32)) as Buffer

        if(storedHash == hash.toString('hex')) return user
        else throw new BadRequestException('Wrong password')
    }
}