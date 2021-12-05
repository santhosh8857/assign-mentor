const { ObjectId } = require("bson");
var express = require("express");
const { MongoClient, dbURL } = require("../dbConfig");
var router = express.Router();

// get mentor details
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbURL);

  try {
    // connection to DB
    const db = client.db("assign-mentor");
    // connecting to collection and fetching details through find()
    const data = await db.collection("mentors").find().toArray();

    res.send({ message: "Success", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  }
});

// post method to create mentor
router.post("/create-mentor", async (req, res) => {
  const client = await MongoClient.connect(dbURL);

  try {
    // connecting to DB
    const db = client.db("assign-mentor");
    // connecting to collection and adding the data through insertOne
    const data = await db.collection("mentors").insertOne(req.body);

    res.send({ message: "mentor created!!!", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

// assign mentor to mulitple students
router.put("/assign-mentor/:id", async (req, res) => {
  const client = await MongoClient.connect(dbURL);
  try {
    // const db = client.db("assign-mentor");
    // const mentorData = await db
    //   .collection("mentors")
    //   .updateOne({ _id: ObjectId(req.params.id) }, { $push: {} });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

module.exports = router;
