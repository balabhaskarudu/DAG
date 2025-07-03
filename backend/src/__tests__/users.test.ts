import request from 'supertest';
import app from '../server';

describe('User Routes', () => {
  const sampleUser = {
    id: 999,
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    address: {
      street: 'Test Street',
      suite: 'Apt 1',
      city: 'Test City',
      zipcode: '12345',
      geo: {
        lat: '0.0000',
        lng: '0.0000'
      }
    },
    phone: '123-456-7890',
    website: 'test.com',
    company: {
      name: 'Test Company',
      catchPhrase: 'Testing is fun',
      bs: 'test business'
    }
  };

  describe('GET /users', () => {
    it('should return paginated users', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('pages');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/users?page=1&limit=5&sortBy=name&order=desc')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(5);
    });
  });

  describe('PUT /users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .put('/users')
        .send(sampleUser)
        .expect(201);

      expect(response.body.id).toBe(sampleUser.id);
      expect(response.body.name).toBe(sampleUser.name);
    });

    it('should return 400 if user already exists', async () => {
      // First create the user
      await request(app)
        .put('/users')
        .send(sampleUser);

      // Try to create again
      const response = await request(app)
        .put('/users')
        .send(sampleUser)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User already exists');
    });

    it('should validate required fields', async () => {
      const invalidUser = { ...sampleUser };
      delete invalidUser.name;

      const response = await request(app)
        .put('/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:userId', () => {
    it('should return user with posts and comments', async () => {
      // First create a user
      await request(app)
        .put('/users')
        .send(sampleUser);

      const response = await request(app)
        .get(`/users/${sampleUser.id}`)
        .expect(200);

      expect(response.body.id).toBe(sampleUser.id);
      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/users/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a specific user', async () => {
      // First create a user
      await request(app)
        .put('/users')
        .send(sampleUser);

      const response = await request(app)
        .delete(`/users/${sampleUser.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User deleted');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/users/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /users', () => {
    it('should delete all users', async () => {
      const response = await request(app)
        .delete('/users')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'All users deleted');
      expect(response.body).toHaveProperty('deletedCounts');
    });
  });
});