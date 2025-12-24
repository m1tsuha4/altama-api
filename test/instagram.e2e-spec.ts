import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

describe('InstagramController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let createdId: string;

  const testImageName = 'test-image.jpg';
  const testImagePath = path.join(__dirname, testImageName);

  beforeAll(async () => {
    // Create a dummy image file
    fs.writeFileSync(testImagePath, 'dummy image content');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();

    // Create a test user and get token
    const email = `test-${Math.random().toString(36).substring(7)}@example.com`;
    const password = 'password123';

    
    // We assume there's a registered user or we create one via Prisma
    // For simplicity, let's try to create one directly if we can, or just use an auth endpoint if available
    // Checking schema: User has email, password, name.
    // We'll create a user directly in DB to avoid relying on User registration endpoint specifics if not known
    // User creation via Prisma removed to avoid conflict with HTTP request below.


    // To get a valid token, we can either:
    // 1. Login via HTTP (needs correct password hash in DB which is hard to mock without bcrypt)
    // 2. Mock the AuthGuard (but we want full integration)
    // 3. Generate a token using JwtService from the module
    
    // Let's try to use the AuthController's login or just generate a token.
    // Since I don't have the bcrypt hash ready and don't want to import bcrypt just for this, 
    // We will use the proper auth flow via HTTP requests

    
    // Let's try creating a user via POST /user
    // But we need to know the DTO.
    // Let's go with a safer bet: Mocking the guard is normally generic, but user asked for "functional testing".
    // I'll try to get JwtService. If it fails, I'll need another plan.
    // OR create a user with a known hash. 
    // 'password123' bcrypt hash is roughly: $2a$10$ep/User/PasswordHash... (dummy)
    // Let's use `npm install bcryptjs` logic implicitly? No, I can't.
    
    // Actually, I can just CREATE the user via POST /user, then login via POST /auth/login.
    // This tests the whole flow.
    
    const userResponse = await request(app.getHttpServer())
      .post('/user')
      .send({
        email: email,
        password: password,
        name: 'Test Instance'
      });
      
    console.log('User Create Status:', userResponse.status);
    console.log('User Create Body:', JSON.stringify(userResponse.body));

    if (userResponse.status === 201 || userResponse.status === 200) {
       const loginResponse = await request(app.getHttpServer())
         .post('/auth/login')
         .send({
           email: email,
           password: password
         });
       
       console.log('Login Status:', loginResponse.status);
       console.log('Login Body:', JSON.stringify(loginResponse.body));

       const body = loginResponse.body;
       // Handle wrapped response if any (e.g. { data: { accessToken: ... } })
       accessToken = body.accessToken || (body.data && body.data.accessToken) || (body.data && body.data.token); 
    } else {
        console.error('Failed to create user');
    }
  });

  afterAll(async () => {
    // Cleanup
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    if (createdId) {
        await prisma.instagram.deleteMany({ where: { id: createdId } });
    }
    
    // Optional: Delete the test user
    // await prisma.user.delete...
    
    await app.close();
  });

  it('should authenticate', () => {
    expect(accessToken).toBeDefined();
  });

  it('/instagram (POST) - should create an instagram post with image', async () => {
    const response = await request(app.getHttpServer())
      .post('/instagram')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', testImagePath)
      .field('title', 'Test Caption')
      .field('link', 'https://test.com')
      .expect(201);

    expect(response.body).toBeDefined();
    // Adjust expectation based on your transformation interceptor
    const data = response.body.data || response.body; 
    expect(data.title).toBe('Test Caption');
    // expect(data.image).toContain(testImageName); // Multer renames it, so this fails.

    // Service: image: image ? `/uploads/instagram/${image?.filename}` : null
    // Multer usually gives a random filename. We check if it's a string and has the correct folder prefix.
    expect(data.image).toBeTruthy();
    expect(data.image).toContain('/uploads/instagram/');
    createdId = data.id;
  });

  it('/instagram (GET) - should return array', async () => {
    const response = await request(app.getHttpServer())
      .get('/instagram')
      .expect(200);

    const data = response.body.data || response.body;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('/instagram/:id (GET) - should return the post', async () => {
    const response = await request(app.getHttpServer())
      .get(`/instagram/${createdId}`)
      .expect(200);

    const data = response.body.data || response.body;
    expect(data.id).toBe(createdId);
  });

  it('/instagram/:id (PATCH) - should update title', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/instagram/${createdId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Caption'
      })
      .expect(200); // or 201 depending on nestjs default for patch

    const data = response.body.data || response.body;
    expect(data.title).toBe('Updated Caption');
  });

  it('/instagram/:id (DELETE) - should remove the post', async () => {
    await request(app.getHttpServer())
      .delete(`/instagram/${createdId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/instagram/${createdId}`)
      .expect(400); // Your service throws BadRequestException('Instagram not found')
  });
});
