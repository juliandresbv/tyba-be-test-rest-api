import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from '../src/user/entities/user.entity';

describe('Tyba BE Test -- (e2e)', () => {
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
    email: '1@email.com',
    password: '1',
  };

  const registerUserMockup = {
    ...loginUserMockup,
    firstName: '1',
  };

  let registeredUserMockup: User = null;

  /**
   * Test cases
   */
  it('should register user -- /v1/auth/register (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUserMockup)
      .expect(201);

    registeredUserMockup = res.body || null;

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      email: expect.any(String),
      firstName: expect.any(String),
    });
  });

  it('should NOT register user: It already exists on DB -- /v1/auth/register (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUserMockup)
      .expect(500);
  });

  it('should login user -- /v1/auth/login (POST)', async () => {
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

  it('should NOT login user: User not found -- /v1/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginUserMockup, email: 'x@email.com' })
      .expect(403);
  });

  it('should NOT login user: Wrong password -- /v1/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginUserMockup, password: '2' })
      .expect(403);
  });

  it('should logout user -- /v1/auth/logout (POST)', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserMockup)
      .expect(201);

    const token = loginRes?.body?.token;

    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set({ Authorization: `Bearer ${token}` })
      .expect(201);
  });

  it('should NOT logout user: No token provided -- /v1/auth/logout (POST)', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserMockup)
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(401);
  });

  it('should NOT logout user: Expired token -- /v1/auth/logout (POST)', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserMockup)
      .expect(201);

    const token = loginRes?.body?.token;

    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set({
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjFAZW1haWwuY29tIiwiZmlyc3ROYW1lIjoiMSIsImlhdCI6MTY1ODc5ODU3MywiZXhwIjoxNjU4ODI3MzczfQ.RAgWiPaFtzY7uTpsJmnmE9zkEFBdFoU21FUGvPOfB8E`,
      })
      .expect(500);
  });

  it('should get user transactions -- /v1/users/:id/transactions (GET)', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserMockup)
      .expect(201);

    const token = loginRes?.body?.token;

    const res = await request(app.getHttpServer())
      .get(`/users/${registeredUserMockup.id}/transactions`)
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

  it('should NOT get user transactions: User does not exist -- /v1/users/:id/transactions (GET)', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUserMockup)
      .expect(201);

    const token = loginRes?.body?.token;

    const res = await request(app.getHttpServer())
      .get(`/users/7777777/transactions`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(404);
  });

  it('should NOT get user transactions: Unauthorized -- /v1/users/:id/transactions (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${registeredUserMockup.id}/transactions`)
      .expect(401);
  });

  it('should get near restaurants by location (lat, long) -- /v1/places?categories={categoryString}&latlong={latlongString} (GET)', async () => {
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

  it('should NOT get near restaurants by location (lat, long): Unauthorized -- /v1/places?categories={categoryString}&latlong={latlongString} (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/places?categories=restaurant&latlong=4.6575715,-74.1122502`)
      .expect(401);
  });
});
