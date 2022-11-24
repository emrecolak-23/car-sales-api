import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';



describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });

  it('it handles signup request', () => {
    const email = 'test6@gmail.com'
    return request(app.getHttpServer())
     .post('/auth/signup')
     .send({email, password: 'pass123'})
     .expect(201)
     .then((res) => {
        const {id, email} = res.body
        expect(id).toBeDefined()
        expect(email).toEqual(email)
     })
  });

  it('sign up as a new user and then get the currently logged in user', async () => {
     const email = 'test2@gmail.com'
     const res = await request(app.getHttpServer())
                    .post('/auth/signup')
                    .send({email, password: 'pass123'})
                    .expect(201)
    
     const cookie = res.get('Set-Cookie')
     
     const { body } = await request(app.getHttpServer())
                            .get('/auth/whoami')
                            .set('Cookie', cookie)
                            .expect(200)

     expect(body.email).toEqual(email)
    
  })
});
