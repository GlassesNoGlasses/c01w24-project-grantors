import express from 'express';
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = 8000;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "test";

// Connect to MongoDB
let db;

async function connectToMongo() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(DB_NAME);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongo();

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});