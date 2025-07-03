import request from 'supertest';
import app from '../server';

describe('Graph Routes', () => {
  const sampleGraph = {
    name: 'Test Graph',
    description: 'A test graph for unit testing',
    nodes: [
      {
        id: '1',
        type: 'editableNode',
        position: { x: 100, y: 100 },
        data: { label: 'Node 1' },
      },
      {
        id: '2',
        type: 'editableNode',
        position: { x: 200, y: 200 },
        data: { label: 'Node 2' },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
      },
    ],
    tags: ['test', 'sample'],
    isPublic: false,
  };

  describe('POST /api/graphs', () => {
    it('should create a new graph', async () => {
      const response = await request(app)
        .post('/api/graphs')
        .send(sampleGraph)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe(sampleGraph.name);
    });

    it('should validate required fields', async () => {
      const invalidGraph = { ...sampleGraph };
      delete invalidGraph.name;

      const response = await request(app)
        .post('/api/graphs')
        .send(invalidGraph)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/graphs', () => {
    it('should return all graphs with pagination', async () => {
      // Create a test graph first
      await request(app)
        .post('/api/graphs')
        .send(sampleGraph);

      const response = await request(app)
        .get('/api/graphs')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('graphs');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.graphs)).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/graphs?page=1&limit=5')
        .expect(200);

      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/graphs/:id', () => {
    it('should return a specific graph', async () => {
      // Create a test graph first
      const createResponse = await request(app)
        .post('/api/graphs')
        .send(sampleGraph);

      const graphId = createResponse.body.data._id;

      const response = await request(app)
        .get(`/api/graphs/${graphId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data._id).toBe(graphId);
    });

    it('should return 404 for non-existent graph', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/graphs/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/graphs/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/graphs/:id', () => {
    it('should update an existing graph', async () => {
      // Create a test graph first
      const createResponse = await request(app)
        .post('/api/graphs')
        .send(sampleGraph);

      const graphId = createResponse.body.data._id;
      const updatedGraph = {
        ...sampleGraph,
        name: 'Updated Test Graph',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/graphs/${graphId}`)
        .send(updatedGraph)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.name).toBe('Updated Test Graph');
    });
  });

  describe('DELETE /api/graphs/:id', () => {
    it('should delete an existing graph', async () => {
      // Create a test graph first
      const createResponse = await request(app)
        .post('/api/graphs')
        .send(sampleGraph);

      const graphId = createResponse.body.data._id;

      const response = await request(app)
        .delete(`/api/graphs/${graphId}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/graphs/:id/duplicate', () => {
    it('should duplicate an existing graph', async () => {
      // Create a test graph first
      const createResponse = await request(app)
        .post('/api/graphs')
        .send(sampleGraph);

      const graphId = createResponse.body.data._id;

      const response = await request(app)
        .post(`/api/graphs/${graphId}/duplicate`)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.name).toContain('(Copy)');
      expect(response.body.data._id).not.toBe(graphId);
    });
  });
});