import { Controller, Post, Body, Get, Param, Patch, Query, Delete, NotFoundException, Session } from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

import { Serialize } from 'src/interceptors/serialize.interceptor';

import { UserDto } from './dtos/user.dto';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(
        private authService: AuthService,
        private userService: UsersService) {}


    @Post('/signup')
    async createUser(@Body() dto: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(dto.email, dto.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async login(@Body() dto: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(dto.email, dto.password)

        session.userId = user.id

        return user
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('Handler is running...')
        const user = await this.userService.findOne(parseInt(id))
        if(!user) throw new NotFoundException('User not found')
        return user
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(parseInt(id), dto)
    }

}
