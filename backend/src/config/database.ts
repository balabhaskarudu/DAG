import { MongoClient, Db } from 'mongodb';

let client: MongoClient;
let database: Db;

export const connectToDatabase = async (): Promise<Db> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Create MongoDB client
    client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    // Connect to MongoDB
    await client.connect();
    
    // Get database name from URI or use default
    const dbName = process.env.DB_NAME || 'dag_editor';
    database = client.db(dbName);

    // Test the connection
    await database.admin().ping();
    
    console.log(`📦 Connected to database: ${dbName}`);
    console.log(`🔗 MongoDB URI: ${mongoUri}${dbName}`);
    
    return database;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const getDatabase = (): Db => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return database;
};

export const closeDatabase = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});