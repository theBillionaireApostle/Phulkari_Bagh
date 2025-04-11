// lib/db.ts
import mongoose from 'mongoose'

/**
 * It's best practice to store the connection string in an environment variable.
 * In Next.js, you typically have a .env.local file (ignored by git) containing:
 * MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority"
 */
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local file")
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents multiple connections to the database.
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
  console.log("Initializing global mongooseCache...");
  cached = global.mongooseCache = { conn: null, promise: null }
}

/**
 * dbConnect
 * Connect to MongoDB using the cached connection if available.
 */
async function dbConnect(): Promise<mongoose.Connection> {
  console.log("dbConnect called. typeof dbConnect:", typeof dbConnect); // Check that dbConnect is a function

  // If a connection is already established, return it
  if (cached.conn) {
    console.log("Reusing cached connection. Connection state:", cached.conn.readyState);
    return cached.conn;
  }

  // If there's no existing connection, create a new one
  if (!cached.promise) {
    console.log("No cached connection promise found. Establishing a new connection...");
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // Additional Mongoose options can be placed here
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        console.log("New connection established. Connection state:", mongooseInstance.connection.readyState);
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error("Error while connecting to MongoDB:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  console.log("Connection obtained from promise. Current connection state:", cached.conn.readyState);
  return cached.conn;
}

export default dbConnect;
