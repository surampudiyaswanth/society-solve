import mongoose from 'mongoose';

let isConnected = false;
let connectionError = null;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/societysolve';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5s timeout instead of hanging
    });

    isConnected = true;
    connectionError = null;
    console.log(`\x1b[32m[Database]\x1b[0m MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.error(`\x1b[31m[Database Error]\x1b[0m Failed to connect to MongoDB: ${error.message}`);
    console.log(`\x1b[33m[Tip for Beginners]\x1b[0m If you do not have MongoDB running locally:`);
    console.log(`  1. Use free MongoDB Atlas: create a cluster and paste the URI in server/.env`);
    console.log(`  2. Or start your local MongoDB service: "net start MongoDB"`);
    console.log(`  3. The server will keep running so you can test frontend and API endpoints!\n`);
    return null;
  }
};

export const getDbStatus = () => ({
  status: isConnected ? 'connected' : 'disconnected',
  error: connectionError,
  host: mongoose.connection.host || null,
  dbName: mongoose.connection.name || null,
});
