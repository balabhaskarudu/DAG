import request from 'supertest';
import app from '../server';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Load Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /load', () => {
    it('should load data from JSONPlaceholder API', async () => {
      // Mock API responses
      const mockUsers = [
        {
          id: 1,
          name: 'Test User',
          username: 'testuser',
          email: 'test@example.com',
          address: {
            street: 'Test St',
            suite: 'Apt 1',
            city: 'Test City',
            zipcode: '12345',
            geo: { lat: '0', lng: '0' }
          },
          phone: '123-456-7890',
          website: 'test.com',
          company: {
            name: 'Test Company',
            catchPhrase: 'Test phrase',
            bs: 'test bs'
          }
        }
      ];

      const mockPosts = [
        {
          userId: 1,
          id: 1,
          title: 'Test Post',
          body: 'Test body'
        }
      ];

      const mockComments = [
        {
          postId: 1,
          id: 1,
          name: 'Test Comment',
          email: 'comment@example.com',
          body: 'Test comment body'
        }
      ];

      (fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUsers,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPosts,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockComments,
        } as Response);

      const response = await request(app)
        .get('/load')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Data loaded');
      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats.users).toBe(1);
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.MockedFunction<typeof fetch>)
        .mockResolvedValueOnce({
          ok: false,
          statusText: 'Not Found',
        } as Response);

      const response = await request(app)
        .get('/load')
        .expect(500);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});