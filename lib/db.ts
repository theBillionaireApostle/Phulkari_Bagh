/* eslint-disable @typescript-eslint/no-require-imports */

// lib/db.ts
import mongoose from 'mongoose'

/**
 * In Next.js, it’s best practice to store your MongoDB connection string
 * in an environment variable. You typically define it in .env.local as:
 * MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority"
 */
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local file")
}

/**
 * We use a global cache to maintain a MongoDB connection across hot reloads
 * in development, or even across multiple invocations in a serverless environment.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

let cached = global.mongooseCache

if (!cached) {
  console.log("Initializing mongooseCache...");
  cached = global.mongooseCache = { conn: null, promise: null }
}

/**
 * dbConnect
 * Connect to MongoDB, using the cache if a connection has already been established.
 */
async function dbConnect(): Promise<mongoose.Connection> {
  // Use an existing connection if available
  if (cached.conn) {
    console.log("Reusing cached connection. Connection state:", cached.conn.readyState);
    return cached.conn;
  }

  // If no connection promise exists, create a new connection promise
  if (!cached.promise) {
    console.log("No cached connection promise found. Establishing a new connection...");
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // You can add additional options here if needed.
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("New connection established. Connection state:", mongooseInstance.connection.readyState);
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error("Error while connecting to the database:", error);
        throw error;
      });
  }

  // Await the connection promise and cache the connection.
  cached.conn = await cached.promise;
  console.log("Connection obtained. Current connection state:", cached.conn.readyState);
  return cached.conn;
}

export default dbConnect;
