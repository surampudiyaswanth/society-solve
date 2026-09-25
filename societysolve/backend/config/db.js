const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/societysolve';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500,
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.log(`[MongoDB] Could not reach primary MongoDB at ${primaryUri}`);
    console.log(`[MongoDB] Initiating embedded in-process MongoDB engine for zero-setup execution...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'societysolve',
        },
      });

      const fallbackUri = mongoServerInstance.getUri();
      const conn = await mongoose.connect(fallbackUri);

      console.log(`[MongoDB] Embedded in-process MongoDB connected successfully: ${fallbackUri}`);
      console.log(`[MongoDB] Tip: To use permanent storage, run local MongoDB or set MONGODB_URI in .env (e.g. MongoDB Atlas).`);

      // Auto-seed initial demo data if database is empty
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const { seedDataInternal } = require('../seed');
        if (typeof seedDataInternal === 'function') {
          console.log('[MongoDB] Auto-seeding initial demo data (citizens, univs, industries, admin, problems)...');
          await seedDataInternal();
        }
      }

      return conn;
    } catch (fallbackError) {
      console.error(`[MongoDB] Failed to start embedded database: ${fallbackError.message}`);
      console.error(`[MongoDB] Tip: Configure a valid MONGODB_URI in backend/.env (e.g. MongoDB Atlas)`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
