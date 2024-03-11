import express from 'express';
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 8000;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "grantors";
const COLLECTIONS = {
  users: "users",
  applications: "applications",
  grants: "grants",
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

function verifyRequestAuth(req, callback) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "secret-key", callback);
}

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

    const userID = user._id;

    const token = jwt.sign({ userID },  "secret-key", { expiresIn: "1h" });

    return res.status(200).send({ id: user._id, username: user.username, 
      email: user.email, firstName: user.firstName, lastName: user.lastName,
      isAdmin: user.isAdmin, organization: user.organization, token: token });

  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error with Logging In');
  }
});
  
  
app.post("/signup", express.json(), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, isAdmin, organization} = req.body;

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
      isAdmin: isAdmin,
      organization: organization,
    });

    // Returning JSON Web Token
    const token = jwt.sign({ username }, "secret-key", { expiresIn: "1h" });
    res.status(201).json({ response: "User registered successfully.", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
