import express from 'express';
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

const app = express();
const PORT = 8000;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "grantors";

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

app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.post('/login', express.json(), async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password both needed to login." });
    }

    const collection = db.collection("users");
    const uname = await collection.findOne({ username:username});
    const email = await collection.findOne({ email:username});

    if (!uname && !email) {
      return res.status(404).json({'error' : 'User Not Found'});
    }

    if (!uname) {
      if (!(email.password === password)) {
        return res.status(401).json({'error' : 'Incorrect Credentials'});
      }
      return res.status(200).send({ admin:email.isAdmin});
    } else if (!(uname.password === password)){
      return res.status(401).json({'error' : 'Incorrect Credentials'});
    }

    return res.status(200).send({ admin:uname.isAdmin});

  } catch {
    res.status(500).send('Server Error with Logging In');
  }
  
  
});