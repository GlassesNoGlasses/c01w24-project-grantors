import express, { application } from 'express';
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
	applicants: "applicants",
	applications: "applications",
	applicationReviews: "applicationReviews",
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

function dbIDToFrontendID(object) {
	return {...object, id: object._id};
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

		if (!isAdmin) {
			// Create applicant profile if not an admin
			const applicantCollection = db.collection(COLLECTIONS.applicants);
			const applicantInsert = await applicantCollection.insertOne({
				_id: insertedId,
				firstName: firstName,
				lastName: lastName,
				email: email,
			});

			if (!applicantInsert.acknowledged) {
				return res.status(500).json({ error: "Failed to create applicant profile "});
			}
		}
		res.status(201).json({ response: "User registered successfully.", token, id: insertedId});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/user', express.json(), async (req, res) => {
	verifyRequestAuth(req, async (err, decoded) => {
		if (err) {
			return res.status(401).send("Unauthorized.");
		}

		const userCollection = db.collection(COLLECTIONS.users);
		const user = await userCollection.findOne({ _id: new ObjectId(decoded.userID) });

		if (!user) {
			return res.status(404).send(decoded.userID);
		}

		// Do not return password hash
		res.status(200).json({ 
			response: {
				accountID: user._id,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				isAdmin: user.isAdmin,
				organization: user.organization,
				authToken: req.headers.authorization.split(" ")[1]
			} 
		});
	});
});

app.patch('/users/:userID/favourites', express.json(), async (req, res) => {
	const userID = req.params.userID;
	const { grantID } = req.body;

	if (!userID || !grantID) {
		return res.status(400).json({ error: "Invalid request." });
	}

	try {
		const userIDObj = new ObjectId(userID);

		const userCollection = db.collection(COLLECTIONS.users);
		const user = await userCollection.findOne({_id: userIDObj});
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const favouriteGrantsCollection = db.collection(COLLECTIONS.favouriteGrants);

		const favourite = await favouriteGrantsCollection.findOne({_id: userIDObj});
		if (!favourite) {
			// user has no favourite array so create one
			const insert = await favouriteGrantsCollection.insertOne(
				{
					_id: userIDObj,
					favourites: [grantID],
				}
			);

			if (!insert.insertedId) {
				return res.status(500).json({ error: "Failed to toggle favourite" });
			}

			return res.status(200).json({ response: "Successfully toggled favourite" });
		}

		const alreadyFavourite = await favouriteGrantsCollection.findOne(
			{
				_id: userIDObj,
				favourites: { $in: [grantID] ,}
			});

		if (alreadyFavourite) {
			const update = await favouriteGrantsCollection.updateOne(
				{
					_id: userIDObj,
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
			{ _id: userIDObj },
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

app.get('/users/:userID/favourites', express.json(), async (req, res) => {
	const userID = req.params.userID;

	if (!userID) {
		return res.status(400).json({ error: "Invalid request." });
	}

	try {
		const favouriteGrantsCollection = db.collection(COLLECTIONS.favouriteGrants);
		const result = await favouriteGrantsCollection.findOne({
			_id: new ObjectId(userID)
		});

		const favourites = result ? result.favourites.map((grantID) => new ObjectId(grantID)) : [];

		const grantsCollection = db.collection(COLLECTIONS.grants);
		const grants = await grantsCollection.find({
			_id: { $in: favourites }
		}).toArray();

		res.status(200).json({ response: grants.map(grant => dbIDToFrontendID(grant)) });
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

app.put("/grant/:grantID", express.json(), async (req, res) => {
	try {
		const { title, description, deadline, minAmount, maxAmount,
			organization, category, contact, questions, publish } = req.body;

		const grantCollection = db.collection(COLLECTIONS.grants);
		const grantID = req.params.grantID

		await grantCollection.updateOne(
			{ _id: new ObjectId(grantID)},
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

		res.status(201).json({ response: "Grant Edited.", id: grantID});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get("/grant/:grantID", express.json(), async(req, res) => {
	try {
		const grantID = req.params.grantID;
		const grantCollection = db.collection(COLLECTIONS.grants);

		const grant = await grantCollection.findOne({
			_id: new ObjectId(grantID)
		});

		if (!grant) {
			return res
			.status(404)
			.json({ error: "Unable to find grant with given ID." });
		}

		res.status(200).json({ response: dbIDToFrontendID(grant) });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
});

app.delete("/grant/:grantID", express.json(), async(req, res) => {
	try {
		const grantID = req.params.grantID;
		const grantCollection = db.collection(COLLECTIONS.grants);

		await grantCollection.deleteOne({
			_id: new ObjectId(grantID)
		});

		res.status(200).json({ response: `grant ${grantID} deleted` });
	} catch (error) {
		console.error(error);
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

		const grants = data.map((grant) => dbIDToFrontendID(grant));

		res.status(200).json({ response: grants });
	} catch (error) {
		console.error("Error getting grants", error);
		res.status(500).json({ error: error.message });
	}
});

app.get("/application/:applicationID", express.json(), async (req, res) => {
	const applicationID = req.params.applicationID;

	try {
		const applicationCollection = db.collection(COLLECTIONS.applications);

		const application = await applicationCollection.findOne({
			_id: new ObjectId(applicationID)
		});

		if (!application) {
			return res.status(404).json({ error: "Application not found." });
		}

		res.status(200).json({ response: dbIDToFrontendID(application) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.post("/application", express.json(), async (req, res) => {
	try {
		const { 
			applicantID,
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
			applicantID: applicantID,
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
				applicantID: applicantID,
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

app.get("/applications", express.json(), async (req, res) => {
	const { userID, organization } = req.query;

	if (!userID && !organization) {
		return res.status(400).json({ error: "Missing required parameters. Include userID or organization." });
	}

	verifyRequestAuth(req, async (err, decoded) => {
		if (err || (userID && userID != decoded.userID)) {
			return res.status(401).send("Unauthorized.");
		}

		let pipeline = [];
		if (userID) {
			pipeline.push({
				$match: {
					applicantID: userID
				}
			});
		}

		if (organization) {
			const userCollection = db.collection(COLLECTIONS.users);
			const user = await userCollection.findOne({ _id: new ObjectId(decoded.userID) });
			if (!user) {
				return res.status(404).send("Organization not found.")
			}

			if (user.organization != organization) {
				return res.status(401).send("Unauthorized.");
			}

			pipeline.push({
				$addFields: {
					convertedGrantID: { $toObjectId: "$grantID" }
				}
			});

			pipeline.push({
				$lookup: {
					from: COLLECTIONS.grants,
					localField: "convertedGrantID",
					foreignField: "_id",
					as: "grant",
				}
			});

			pipeline.push({
				$unwind: "$grant"
			});

			pipeline.push({
				$match: {
					"grant.organization": organization
				}
			});
		}

		const applicationsCollection = db.collection(COLLECTIONS.applications);
		const applications = await applicationsCollection.aggregate(pipeline).toArray();

		res.json({ response: applications.map((app) => dbIDToFrontendID(app)) });
	});
});

app.get("/applicant/:applicantID", express.json(), async (req, res) => {
	const applicantID = req.params.applicantID;

	try {
		const applicantCollection = db.collection(COLLECTIONS.applicants);

		const applicant = await applicantCollection.findOne({
			_id: new ObjectId(applicantID)
		});

		if (!applicant) {
			return res.status(404).json({ error: "Applicant not found." });
		}

		res.status(200).json({ response: applicant });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.get("/applicants", express.json(), async (req, res) => {
	const { encodedApplicantIDs } = req.query;

	const filters = {}
	if (encodedApplicantIDs) {
		const applicantIDs = encodedApplicantIDs.split(',').map((id) => new ObjectId(id));
		filters._id = { $in: applicantIDs };
	}

	try {
		const applicantCollection = db.collection(COLLECTIONS.applicants);

		const applicants = await applicantCollection.find(filters).toArray();

		res.status(200).json({ response: applicants.map((applicant) => dbIDToFrontendID(applicant)) });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.post("/review", express.json(), async (req, res) => {
	const { applicationID, reviewerID, reviewText, rating, applicationStatus} = req.body;
	try {
		const reviewsCollection = db.collection(COLLECTIONS.applicationReviews);

		const existingReview = await reviewsCollection.findOne({
			applicationID: applicationID,
			reviewerID: reviewerID,
		});

		if (existingReview) {
			return res.status(400).json({ error: "Review already exists. Use patch to update review." });
		}

		const {insertedId} = await reviewsCollection.insertOne({
			applicationID: applicationID,
			reviewerID: reviewerID,
			reviewText: reviewText,
			rating: rating,
			applicationStatus: applicationStatus,
		});

		if (!insertedId) {
			return res.status(500).json({ errror: "Failed to insert review" });
		}

		const applicationCollection = db.collection(COLLECTIONS.applications);
		const statusUpdate = await applicationCollection.updateOne(
			{
			_id: new ObjectId(applicationID)
			},
			{
				$set: { status: applicationStatus }
			});

		if (statusUpdate.matchedCount === 0) {
			return res.status(400).json({ error: "Failed to update application status. ApplicationID invalid." });
		}

		res.status(201).json({ response: "Review submitted.", id: insertedId});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.get("/review/:applicationID", express.json(), async (req, res) => {
	const applicationID = req.params.applicationID;

	try {
		verifyRequestAuth(req, async (err, decoded) => {
			if (err) {
				return res.status(401).send("Unauthorized.");
			}
			const reviewsCollection = db.collection(COLLECTIONS.applicationReviews);

			const review = await reviewsCollection.findOne({
				applicationID: applicationID,
				reviewerID: decoded.userID,
			});

			if (!review) {
				return res.status(404).json({ error: "Review not found." });
			}

			res.status(200).json({ response: review });
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});