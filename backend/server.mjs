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
  grants: "grants"
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
      firstName:user.firstName, lastName:user.lastName, isAdmin:user.isAdmin, user: user});

  } catch {
    res.status(500).send('Server Error with Logging In');
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

app.post("/createGrant", express.json(), async (req, res) => {
  try {
    const { accId, title, description, deadline, minAmount, maxAmount,
      organization, category, contact, questions, publish } = req.body;
    
    const grantCollection = db.collection(COLLECTIONS.grants);

    const {acknowledged, insertedId} = await grantCollection.insertOne({
      title: title,
      description: description,
      deadline: deadline,
      minAmount: minAmount,
      maxAmount: maxAmount,
      organization: organization,
      category: category,
      contact: contact,
      questions: questions,
      publish: publish,
      owner: accId
    });

    res.status(201).json({ response: "Grant Saved.", id: insertedId});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/editGrant/:grantId", express.json(), async (req, res) => {
  try {
    const { accId, title, description, deadline, minAmount, maxAmount,
      organization, category, contact, questions, publish } = req.body;
    
    const grantCollection = db.collection(COLLECTIONS.grants);
    const grantId = req.params.grantId

    await grantCollection.updateOne(
      { _id: new ObjectId(grantId)},
      {$set: {
      title: title,
      description: description,
      deadline: deadline,
      minAmount: minAmount,
      maxAmount: maxAmount,
      organization: organization,
      category: category,
      contact: contact,
      questions: questions,
      publish: publish,
      owner: accId
    }});
    
    res.status(201).json({ response: "Grant Edited.", id: grantId});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/addGrantToAdminList', express.json(), async(req, res) => {
  try {
    const { accId, grantId, title, description, deadline, minAmount, maxAmount,
      organization, category, contact, questions } = req.body;
    
    const userCollection = db.collection(COLLECTIONS.users);

    const grant = { _id: new ObjectId(grantId), 
                  title: title,
                  description: description,
                  deadline: deadline,
                  minAmount: minAmount,
                  maxAmount: maxAmount,
                  organization: organization,
                  category: category,
                  contact: contact,
                  questions: questions,
                  publish: false,
                  owner: accId }

    const data = await userCollection.findOne({_id: new ObjectId(accId)})

    const grants = data.grants

    const newGrants = !grants ? [grant] : [...(grants.filter(prev => prev._id != grantId)), grant]

    await userCollection.updateOne({ _id: new ObjectId(accId)},
                                  {$set: { grants: newGrants }})
    
    
    res.status(201).json({ response: "Grant Saved to Admin Account."});
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
})

app.get("/getGrant/:grantId", express.json(), async(req, res) => {
  try {

    const grantId = req.params.grantId;
    const grantCollection = db.collection(COLLECTIONS.grants);

    const data = await grantCollection.findOne({
      _id: new ObjectId(grantId)
    });

    if (!data) {
      return res
        .status(404)
        .json({ error: "Unable to find grant with given ID." });
    }

    res.status(200).json({ response: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.delete("/deleteGrant/:grantId", express.json(), async(req, res) => {
  try {

    const { accId } = req.body 

    const grantId = req.params.grantId;
    const grantCollection = db.collection(COLLECTIONS.grants);
    const userCollection = db.collection(COLLECTIONS.users);

    await grantCollection.deleteOne({
      _id: new ObjectId(grantId)
    })

    const data = await userCollection.findOne({_id: new ObjectId(accId)})
    const grants = data.grants
    const newGrants = grants.length == 1 ? [] : [...(grants.filter(prev => prev._id != grantId))]

    console.log(newGrants)

    await userCollection.updateOne({ _id: new ObjectId(accId)},
                                  {$set: { grants: newGrants }})

    res.status(200).json({ response: `grant ${grantId} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})