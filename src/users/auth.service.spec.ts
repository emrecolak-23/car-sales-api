import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { BadRequestException,NotFoundException } from '@nestjs/common';

describe( 'AuthService', () => {

    let service;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
         // Create a fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password} as User)
        }
       
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()
    
        service = module.get(AuthService)
    })
    
    
    it('can create an instance of auth service', () => {
       
        expect(service).toBeDefined()
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
    });

    it('created a new user with salted and hashed password', async () => {
        const user = await service.signup('test@gmail.com', 'pass123')

        expect(user.password).not.toEqual('pass123')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })
    
    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });    

    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
          Promise.resolve([
            { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
          ]);
        await expect(
          service.signin('laskdjf@alskdfj.com', 'passowrd'),
        ).rejects.toThrow(BadRequestException);
    });
    
})
