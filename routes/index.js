var express = require("express");
var router = express.Router();
const { dbURL, MongoClient, mongodb } = require("../dbConfig");
const { ObjectId } = require("mongodb");
// get home
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbURL);

  try {
    const db = client.db("assign-mentor");
    const mentors = await db.collection("mentors").find().toArray();
    const students = await db.collection("students").find().toArray();
    res.send({
      message: "Success",
      data: {
        mentors: mentors,
        students: students,
      },
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

module.exports = router;
