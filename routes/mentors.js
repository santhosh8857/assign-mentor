var express = require("express");
var router = express.Router();
const { MongoClient, dbURL } = require("../dbConfig");
const { ObjectId } = require("bson");

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
router.put("/assign-students/:id", async (req, res) => {
  const client = await MongoClient.connect(dbURL);
  try {
    const db = client.db("assign-mentor");
    let flag = 0; // to check the mentor is assigned

    // assign the req arr to studentArr
    let studentArr = req.body.students;

    // fetch the mentor details by id to assign the mentor name to student collection
    const mentorDetails = await db
      .collection("mentors")
      .findOne({ _id: ObjectId(req.params.id) });

    // iterating through req array (studentArr)
    studentArr.forEach(async (student) => {
      // to check whether the student is already assigned to that mentor to avoid duplicates
      let find = mentorDetails.students.indexOf(student);

      if (find === -1) {
        // updating the student Array in mentor collection
        const mentorData = await db
          .collection("mentors")
          .updateOne(
            { _id: ObjectId(req.params.id) },
            { $push: { students: student } }
          );

        // updating the mentor name in the student collection
        const studentData = await db
          .collection("students")
          .updateOne(
            { name: student },
            { $set: { mentor: mentorDetails.name } }
          );
        flag = 1;
      } else {
        console.log(`${student} is already assigned to requested mentor`);
      }
    });

    // to whether the mentor is assigned or not
    if (flag === 1) res.send({ message: "Mentor Assigned!!!" });
    else res.send({ message: "Students already assigned to the mentor" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  }
});

module.exports = router;
