import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let httpServer: any;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    httpServer = app.getHttpServer();
    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World! 123');
  });

  let createdUserId: string;

//   it('/user (POST) - create user', async () => {
//     const res = await request(httpServer)
//       .post('/v1/user')
//       .set('Authorization', 'Bearer <your_jwt_token_if_needed>')
//       .send({
//         email: 'e2e@example.com',
//         password: '123456',
//         username: 'e2euser',
//       });

//     expect(res.status).toBe(201);
//     expect(res.body).toHaveProperty('id');
//     createdUserId = res.body.id;
//   });
});
