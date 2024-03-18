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
	favouriteGrants: "favouriteGrants",
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

function dbGrantToFrontendGrant(grant) {
	return {...grant, id: grant._id};
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
		isAdmin: user.isAdmin, organization: user.organization, authToken: token });

	} catch (err) {
		console.error(err)
		res.status(500).send('Server Error with Logging In');
	}
});
  
app.post("/signup", express.json(), async (req, res) => {
	try {
		const { username, email, password, firstName, lastName, isAdmin, organization } = req.body;

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
			organization: organization,
		});

		// Returning JSON Web Token
		const token = jwt.sign({ username }, "secret-key", { expiresIn: "1h" });
		res.status(201).json({ response: "User registered successfully.", token, id: insertedId});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.patch('/users/:userId/favourites', express.json(), async (req, res) => {
	const userId = req.params.userId;
	const { grantID } = req.body;

	if (!userId || !grantID) {
		return res.status(400).json({ error: "Invalid request." });
	}

	const userIdObj = new ObjectId(userId);

	try {
		const favouriteGrantsCollection = db.collection(COLLECTIONS.favouriteGrants);

		const favourite = await favouriteGrantsCollection.findOne({_id: userIdObj});
		if (!favourite) {
			// user has no favourite array so create one
			const insert = await favouriteGrantsCollection.insertOne(
			{
				_id: userIdObj,
				favourites: [grantID],
			});

			if (!insert.insertedCount) {
				return res.status(500).json({ error: "Failed to toggle favourite" });
			}

			return res.status(200).json({ response: "Successfully toggled favourite" });
		}

		const alreadyFavourite = await favouriteGrantsCollection.findOne(
			{
				_id: userIdObj,
				favourites: { $in: [grantID] ,}
			});

		if (alreadyFavourite) {
			const update = await favouriteGrantsCollection.updateOne(
				{
					_id: userIdObj,
				},
				{
					$pull: { favourites: grantID },
				},
			);

			if (!update.modifiedCount) {
				return res.status(500).json({ error: "Failed to create favourites array." })
			}
			return res.status(200).json({ response: "Successfully toggled favourite" });
		}

		const result = await favouriteGrantsCollection.updateOne(
			{ _id: userIdObj },
			{
				$push: { favourites: grantID },
			},
		);

		if (result.modifiedCount === 0) {
			return res.status(404).json({ error: "User not found or data not changed." });
		}

		res.status(200).json({ message: "Favorites updated successfully." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error." });
	}
});

app.get('/users/:userId/favourites', express.json(), async (req, res) => {
	const userId = req.params.userId;

	if (!userId) {
		return res.status(400).json({ error: "Invalid request." });
	}

	try {
		const favouriteGrantsCollection = db.collection(COLLECTIONS.favouriteGrants);
		const result = await favouriteGrantsCollection.findOne({
			_id: new ObjectId(userId)
		});

		const favourites = result ? result.favourites.map((grantId) => new ObjectId(grantId)) : [];

		const grantsCollection = db.collection(COLLECTIONS.grants);
		const grants = await grantsCollection.find({
			_id: { $in: favourites }
		}).toArray();

		res.status(200).json({ response: grants.map(grant => dbGrantToFrontendGrant(grant)) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error." });
	}
});

app.post("/grant", express.json(), async (req, res) => {
	try {
		// frontend guarantees that all these fields are provided so omit param check
		const { title, description, deadline, posted, minAmount, maxAmount,
			organization, category, contact, questions, publish } = req.body;

		const grantCollection = db.collection(COLLECTIONS.grants);

		const {insertedId} = await grantCollection.insertOne({
			title: title,
			description: description,
			posted: posted,
			deadline: deadline,
			minAmount: minAmount,
			maxAmount: maxAmount,
			organization: organization,
			category: category,
			contact: contact,
			questions: questions,
			publish: publish,
		});

		res.status(201).json({ response: "Grant Saved.", id: insertedId});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.put("/grant/:grantId", express.json(), async (req, res) => {
	try {
		const { title, description, deadline, minAmount, maxAmount,
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
		}});

		res.status(201).json({ response: "Grant Edited.", id: grantId});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/grant/:grantId", express.json(), async(req, res) => {
	try {
		const grantId = req.params.grantId;
		const grantCollection = db.collection(COLLECTIONS.grants);

		const grant = await grantCollection.findOne({
			_id: new ObjectId(grantId)
		});

		if (!grant) {
			return res
			.status(404)
			.json({ error: "Unable to find grant with given ID." });
		}

		res.status(200).json({ response: dbGrantToFrontendGrant(grant) });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/grants", express.json(), async(req, res) => {
	// Get route query parameters (/grants?publish=true)
	const { encodedGrantIDs, publish, organization } = req.query;

	let filters = {};
	if (encodedGrantIDs) {
		const grantIDs = encodedGrantIDs.split(',').map((id) => new ObjectId(id));
		filters._id = { $in: grantIDs };
	}
	if (publish) {
		filters.publish = publish;
	}
	if (organization) {
		filters.organization = organization;
	}

	try {
		const grantCollection = db.collection(COLLECTIONS.grants);

		const data = await grantCollection.find(filters).toArray();

		const grants = data.map((grant) => dbGrantToFrontendGrant(grant));

		res.status(200).json({ response: grants });
	} catch (error) {
		console.error("Error getting grants", error);
		res.status(500).json({ error: error.message });
	}
});

app.delete("/grant/:grantId", express.json(), async(req, res) => {
	try {
		const grantId = req.params.grantId;
		const grantCollection = db.collection(COLLECTIONS.grants);

		await grantCollection.deleteOne({
			_id: new ObjectId(grantId)
		});

		res.status(200).json({ response: `grant ${grantId} deleted` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.post("/application", express.json(), async (req, res) => {
	try {
		const { 
			userID,
			grantID,
			grantTitle, 
			grantCategory,
			submitted,
			submissionDate,
			status,
			awarded,
			responses, } = req.body;

		const applicationCollection = db.collection(COLLECTIONS.applications);
		const existingApplication = await applicationCollection.findOne({
			userID: userID,
			grantID: grantID,
		});

		if (existingApplication) {
			// User's application for this grant already exists, so update it
			const update = await applicationCollection.updateOne(
				{_id: existingApplication._id},
				{$set: {
						submitted: submitted,
						submissionDate: submissionDate,
						status: status,
						awarded: awarded,
						responses: responses,
					}
				});
			if (update.modifiedCount === 1) {
				return res.status(201).json({ response: "Application submitted successfully." });
			}

			return res.status(500).json( {error: "Failed to update application."} );
		}

		const inserted = await applicationCollection.insertOne(
			{
				userID: userID,
				grantID: grantID,
				grantTitle: grantTitle,
				grantCategory: grantCategory,
				submitted: submitted,
				submissionDate: submissionDate,
				status: status,
				awarded: awarded,
				responses: responses,
			}
		);

		if (inserted.insertedId) {
			return res.status(201).json({ response: "Application submitted successfully.", insertedID: inserted.insertedId });
		}

		return res.status(500).json({ error: "Failed to insert application." });
	} catch (error) {
		console.error("Error submitting application:", error.message);
		return res.status(500).json({ error: error.message});
	}
});

app.get("/organization/:organization/applications", express.json(), async (req, res) => {
	const organization = req.params.organization;

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
				$addFields: {
					grantObjectId: { $toObjectId: "$grantID" }
				}
			},
			{
				$lookup: {
					from: COLLECTIONS.grants,
					localField: 'grantObjectId',
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

		res.json({ response: applications });
	});
});

app.get("/user/:userID/applications", express.json(), async (req, res) => {
	const userID = req.params.userID;

	verifyRequestAuth(req, async (err, decoded) => {
		if (err) {
			return res.status(401).send("Unauthorized.");
		}

		if (!userID) {
			// If no organization was provided, get the org from auth token
			const userCollection = db.collection(COLLECTIONS.users);
			const user = await userCollection.findOne({ _id: decoded });
			if (!user) {
				return res.status(400).send("userID not provided.")
			}

			userID = user._id;
		}

		const applicationCollection = db.collection(COLLECTIONS.applications);
		const applications = await applicationCollection.find({ userID: { $eq: userID } }).toArray();

		res.json({ response: applications });
	});
});