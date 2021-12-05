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

// assign student to mentor
router.put("/assign-mentor/:id", async (req, res) => {
  const client = await MongoClient.connect(dbURL);

  try {
    const db = client.db("assign-mentor");

    // to get the student details
    const studentDetails = await db
      .collection("students")
      .findOne({ _id: ObjectId(req.params.id) });

    // to get the mentor details to update the student array
    const mentorDetails = await db
      .collection("mentors")
      .findOne({ name: req.body.mentor });

    // to verify mentor is available
    if (mentorDetails) {
      // updating student collection
      let find = mentorDetails.students.indexOf(`${studentDetails.name}`);
      if (find === -1) {
        const studentData = await db
          .collection("students")
          .updateOne(
            { _id: ObjectId(req.params.id) },
            { $set: { mentor: req.body.mentor } }
          );

        // updating mentor collection
        const mentorData = await db.collection("mentors").updateOne(
          { name: req.body.mentor },
          // pushing the student name to the mentor collection student table.
          { $push: { students: studentDetails.name } }
        );
        res.send({ message: "Mentor Assigned!!!" });
      } else {
        res.send({
          message: "Student is already assigned to requested mentor",
        });
      }
    } else {
      res.send({ message: "Mentor is not available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in Connection" });
  } finally {
    client.close();
  }
});

module.exports = router;
