import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

let mongod: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Set test environment variables
  process.env.MONGO_URI = uri;
  process.env.NODE_ENV = 'test';
  process.env.PORT = '5001';
  
  // Connect to the in-memory database
  client = new MongoClient(uri);
  await client.connect();
});

afterAll(async () => {
  // Clean up
  if (client) {
    await client.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});

afterEach(async () => {
  // Clear all collections after each test
  if (client) {
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }
});