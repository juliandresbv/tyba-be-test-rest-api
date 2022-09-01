import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/user/entities/user.entity';

describe('Tyba BE Engineer Test -- (e2e tests)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  /**
   * Data mockups
   */
  const loginUserMockup = {
    email: '7777777@email.com',
    password: '7',
  };

  const registerUserMockup = {
    ...loginUserMockup,
    firstName: '7',
  };

  let registeredUserMockup: User = null;

  /**
   * Test cases
   */
  describe('register use cases -- /api/v1/users (POST)', () => {
    it('should register user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(registerUserMockup)
        .expect(201);

      registeredUserMockup = res.body || null;

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        firstName: expect.any(String),
      });
    });

    it('should NOT register user: User already exists on DB', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(registerUserMockup)
        .expect(500);
    });
  });

  describe('login use cases -- /api/v1/auth/login (POST)', () => {
    it('should login user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserMockup)
        .expect(201);

      expect(res.body).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        firstName: expect.any(String),
        token: expect.any(String),
      });
    });

    it('should NOT login user: User not found', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginUserMockup, email: 'x@email.com' })
        .expect(403);
    });

    it('should NOT login user: Wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginUserMockup, password: '2' })
        .expect(403);
    });
  });

  describe('logout use cases -- /api/v1/auth/logout (POST)', () => {
    it('should logout user', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserMockup)
        .expect(201);

      const token = loginRes?.body?.token;

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set({ Authorization: `Bearer ${token}` })
        .expect(201);
    });

    it('should NOT logout user: Unathorized', async () => {
      await request(app.getHttpServer()).post('/auth/logout').expect(401);
    });

    it('should NOT logout user: Expired token', async () => {
      const fakeToken = `${'a'.repeat(36)}.${'b'.repeat(98)}.${'c'.repeat(43)}`;

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set({
          Authorization: `Bearer ${fakeToken}`,
        })
        .expect(401);
    });
  });

  describe('get user transactions use cases -- /api/v1/users/:id/transactions (GET)', () => {
    it('should get user transactions', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserMockup)
        .expect(201);

      const token = loginRes?.body?.token;

      const res = await request(app.getHttpServer())
        .get(`/users/${registeredUserMockup?.id}/transactions`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200);

      if ((res?.body as []).length > 0) {
        const firstItem = res?.body?.[0];

        expect(firstItem).toMatchObject({
          id: expect.any(Number),
          userEmail: expect.any(String),
          value: expect.any(String),
        });
      }
    });

    it('should NOT get user transactions: User does not exist', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserMockup)
        .expect(201);

      const token = loginRes?.body?.token;

      await request(app.getHttpServer())
        .get(`/users/7777777/transactions`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(404);
    });

    it('should NOT get user transactions: Unauthorized', async () => {
      await request(app.getHttpServer())
        .get(`/users/${registeredUserMockup.id}/transactions`)
        .expect(401);
    });
  });

  describe('get nearby restaurants use cases -- /api/v1/places?categories={categories}&latlong={latlong} (GET)', () => {
    it('should get near restaurants by location (lat, long)', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserMockup)
        .expect(201);

      const token = loginRes?.body?.token;

      const res = await request(app.getHttpServer())
        .get(`/places?categories=restaurant&latlong=4.6575715,-74.1122502`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200);

      if ((res?.body as []).length > 0) {
        const firstItem = res?.body?.[0];

        expect(firstItem).toMatchObject({
          location: expect.any(Object),
          name: expect.any(String),
        });
      }
    });

    it('should NOT get near restaurants by location (lat, long): Unauthorized', async () => {
      await request(app.getHttpServer())
        .get(`/places?categories=restaurant&latlong=4.6575715,-74.1122502`)
        .expect(401);
    });
  });
});
