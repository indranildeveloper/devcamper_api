import mongoose from "mongoose";

/**
 * Asynchronously connects to the MongoDB database using the connection string
 * specified in the MONGO_URI environment variable. Logs the host of the connected
 * database upon successful connection.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the database connection is established.
 * @throws {Error} If the connection to MongoDB fails.
 */
const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(
    `MongoDB Connected: ${connection.connection.host}`.cyan.underline.bold
  );
};

export default connectDB;
