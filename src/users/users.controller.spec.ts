import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

import { UsersService } from './users.service'
import { AuthService } from './auth.service'

import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService : Partial<UsersService>
  let fakeAuthService: Partial<AuthService>

  beforeEach(async () => {

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'eymen@gmail.com', password: 'pass123'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([{id: 1, email, password: 'pass123'} as User])
      },
      // remove: () => {},
      // update: () => {}
    }

    fakeAuthService = {
      // signin: () => {},
      // signup: () => {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
