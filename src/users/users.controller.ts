import { Controller, Post, Body, Get, Param, Patch, Query, Delete, NotFoundException, UseInterceptors } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post('/signup')
    createUser(@Body() dto: CreateUserDto) {
        this.userService.create(dto.email, dto.password)
    }

    @UseInterceptors(SerializeInterceptor)
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
