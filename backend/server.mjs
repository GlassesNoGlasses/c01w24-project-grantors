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

    return res.status(200).send({ accountID: user._id, username: user.username, 
      email: user.email, firstName: user.firstName, lastName: user.lastName,
      isAdmin: user.isAdmin, organization: user.organization, token: token });

  } catch (err) {
    console.log(err)
    res.status(500).send('Server Error with Logging In');
  }
});
  
  
app.post("/signup", express.json(), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, isAdmin, organization, favoriteGrants} = req.body;

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
    const {insertedId} = await userCollection.insertOne({
      username: username,
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      isAdmin: isAdmin,
      favoriteGrants: favoriteGrants,
      organization: organization,
    });

    // Returning JSON Web Token
    const token = jwt.sign({ username }, "secret-key", { expiresIn: "1h" });
    res.status(201).json({ response: "User registered successfully.", token, id: insertedId});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/users/:userId/favorites', express.json(), async (req, res) => {
  const userId = req.params.userId;
  const { favoriteGrants } = req.body;

  if (!userId || !Array.isArray(favoriteGrants)) {
    return res.status(400).json({ error: "Invalid request." });
  }

  try {
    const userCollection = db.collection(COLLECTIONS.users);
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { favoriteGrants: favoriteGrants } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found or data not changed." });
    }

    res.status(200).json({ message: "Favorites updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
})
app.post("/createGrant", express.json(), async (req, res) => {
  try {

    // frontend guarantees that all these fields are provided so omit param check
    const { accId, title, description, deadline, minAmount, maxAmount,
      organization, category, contact, questions, publish } = req.body;
    
    const grantCollection = db.collection(COLLECTIONS.grants);

    const {insertedId} = await grantCollection.insertOne({
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
      organization, category, contact, questions, publish } = req.body;
    
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
                  publish: publish,
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

    await userCollection.updateOne({ _id: new ObjectId(accId)},
                                  {$set: { grants: newGrants }})

    res.status(200).json({ response: `grant ${grantId} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get("/getApplications", express.json(), async (req, res) => {
  const { organization } = req.body();

  verifyRequestAuth(req, async (err, decoded) => {
    if (err) {
        return res.status(401).send("Unauthorized.");
    }

    if (!organization) {
      // If no organization was provided, get the org from auth token
      const userCollection = db.collection(COLLECTIONS.users);
      const user = await userCollection.findOne({ _id: decoded });
      if (!user) {
        return res.status(400).send("Organization not provided.")
      }

      organization = user.organization;
    }

    const applicationCollection = db.collection(COLLECTIONS.applications)

    // Looks up all applications, where the associate grant belongs to the organization
    const pipeline = [
      {
        $lookup: {
          from: COLLECTIONS.grants,
          localField: 'grantID',
          foreignField: '_id',
          as: 'grant',
        }
      },
      {
        $match: {
          'grant.organization': organization
        }
      }
    ]

    const applications = await applicationCollection.aggregate(pipeline).toArray();

    res.json({ applications: applications });
  });
});
