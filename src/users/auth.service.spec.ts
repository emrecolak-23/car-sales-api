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
        const users: User[] = []
        fakeUsersService = {
            find: (email) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) =>{
                const user = {id: Math.floor(Math.random() * 99999), email, password} as User
                users.push(user)
                return Promise.resolve(user)
            }
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
        await service.signup('asdf@asdf.com', 'asdf')
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
        await service.signup('laskdjf@alskdfj.com', 'aslsaşdksfl')
        await expect(
          service.signin('laskdjf@alskdfj.com', 'passowrd'),
        ).rejects.toThrow(BadRequestException);
    });
    

    it('returns a user if correct password is provided', async () => {
        await service.signup('test@test.com', 'pass123')
        const user = await service.signin('test@test.com', 'pass123')
        expect(user).toBeDefined()

   
    })

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
          BadRequestException,
        );
    });

})
