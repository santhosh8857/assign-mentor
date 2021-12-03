var express = require("express");
var router = express.Router();

// mongoDB
const { mongodb, MongoClient, dbURL } = require("../dbConfig");
const { ObjectId } = require("mongodb");

// get student details
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbURL);

  try {
    // connecting to DB
    const db = client.db("assign-mentor");
    // connecting to collection and fetching the data through find()
    const data = await db.collection("students").find().toArray();

    res.send({ message: "Success", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

// post -> create student
router.post("/create-student", async (req, res) => {
  const client = await MongoClient.connect(dbURL);

  try {
    const db = client.db("assign-mentor");
    const data = await db.collection("students").insertOne(req.body);

    res.send({ message: "Student created!!!", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

module.exports = router;
