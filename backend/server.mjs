import express from 'express';
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 8000;
let MONGO_URL;
if (process.env.ENV === 'Docker') {
  MONGO_URL = 'mongodb://mongodb:27017';
} else {
  MONGO_URL = 'mongodb://127.0.0.1:27017';
}
const DB_NAME = "grantors";
const COLLECTIONS = {
  users: "users",
  user_grant_submissions: "user_grant_submissions"
};

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
        .json({ 'error': "Username and password both needed to login." });
    }

    // username could be the user's username or their email, so we will check both
    const collection = db.collection("users");
    const uname = await collection.findOne({ username:username});
    const email = await collection.findOne({ email:username});

    const user = uname ? uname : email;

    if (!user) {
      return res.status(404).json({'error' : 'User Not Found'});
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({'error' : 'Incorrect Credentials'});
    }

    return res.status(200).send({ id:user._id, username:user.username, email:user.email,
      firstName:user.firstName, lastName:user.lastName, isAdmin:user.isAdmin, });

  } catch {
    res.status(500).send('Server Error with Logging In');
  }
});
  
app.post("/sendForm", express.json(), async (req, res) => {
  try {
    const {username, grantId, data} = req.body;
    if (!username || !grantId) {
      return res
        .status(400)
        .json({error: "Form sent without username or grantId"})
    }

    const userSubmissionsDatabase = db.collection("user_grant_submissions");
    await userSubmissionsDatabase.insertOne({
      username: username,
      grantId: grantId,
      data: data
    });

    res.status(201).json({response: "Form submitted succesfully."});
  }
  catch (error)
  {
    res.status(500).json({ error: error.message });
  }
});
  
app.post("/signup", express.json(), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, isAdmin} = req.body;

    // Basic body request check
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username and email and password are all needed to register." });
    }

    // Checking if username does not already exist in database
    const userCollection = db.collection(COLLECTIONS.users);
    const existingUser = await userCollection.findOne({ username });
    const existingEmail = await userCollection.findOne({ email });
    if (existingUser || existingEmail) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Creating hashed password 
    // and storing user info in database
    const hashedPassword = await bcrypt.hash(password, 10);
    await userCollection.insertOne({
      username: username,
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      isAdmin: isAdmin
    });

    // Returning JSON Web Token
    const token = jwt.sign({ username }, "secret-key", { expiresIn: "1h" });
    res.status(201).json({ response: "User registered successfully.", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});