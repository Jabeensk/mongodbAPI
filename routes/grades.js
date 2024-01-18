import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.js";
import Grade from '../models/grades.js';

const router = express.Router();


// Create a single grade entry
router.post('/', async (req, res) => {
  // const collection = await db.collection('grades');
  const newDocument = req.body;
  console.log(newDocument);

  if (newDocument.student_id) {
      newDocument.learner_id = newDocument.student_id;
      delete newDocument.student_id;
  }

  // const result = await collection.insertOne(newDocument);
  const result = await Grade.create(newDocument);
  res.send(result).status(204);
});

// Get a single grade entry
router.get('/', async (req, res) => {
  // const collection = await db.collection("grades");
  // const result = await collection.find();
  const result = await Grade.find({});
  res.send(result);

});

router.get("/:id", async (req, res) => {
  //   const collection = await db.collection("grades");
  //   const query = { _id: new ObjectId(req.params.id) };
  //   const result = await collection.findOne(query);
  
      const result = await Grade.findById(req.params.id);
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });
  
 // Add a score to a grade entry
 router.patch('/:id/scores/add', async (req, res) => {
  // find the grade to update
  const grade = await Grade.findOne({_id: req.params.id});
 
  if (!grade) return res.send('Grade not found!')
  // add the new score (req.body) to the scores array
  grade.scores.push(req.body);
  // save doc
  await grade.save();
  res.send(grade);

});

  // Remove a score from a grade entry
  router.patch('/:id/remove', async (req, res) => {
    try {
      const result = await Grade.findByIdAndUpdate(
        req.params.id,
        { $pull: { scores: req.body } },
        { new: true }
      );
      if (!result) return res.status(404).send('Not found');
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // Delete a single grade entry
router.delete('/:id', async (req, res) => {
  try {
    const result = await Grade.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('Not found');
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
  

  // Student route for backwards compatibility
router.get('/student/:id', async (req, res) => {
    res.redirect(`/grades/learner/${req.params.id}`);
 });

// Get a learner's grade data
router.get('/learner/:id', async (req, res) => {
  // const collection = await db.collection("grades");
    // const query = {learner_id: Number(req.params.id)};
    // const result = await collection.find(query).toArray();
    const result = await Grade.find({learner_id: req.params.id});

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});
//  GET /class/:id

router.get('/class/:id', async (req, res) => {
   // const collection = await db.collection('grades');
   // const query = {class_id: Number(req.params.id)};
   // const result = await collection.find(query).toArray();
   const result = await Grade.find({class_id: req.params.id})

   if (result.length < 1) res.status(404).send("Not Found");
   else res.send(result).status(200);
});
 // Delete a learner's grade data
router.delete('/learner/:id', async (req, res) => {
  try {
    const query = { learner_id: Number(req.params.id) };
    const result = await Grade.deleteOne(query);
    if (!result) return res.status(404).send('Not found');
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



  // Delete a class
router.delete('/class/:id', async (req, res) => {
  try {
    const query = { class_id: Number(req.params.id) };
    const result = await Grade.deleteMany(query);
    if (!result) return res.status(404).send('Not found');
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

  
  
// Get a class's grade data
router.get("/class/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };
    let result = await collection.find(query).toArray();
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

  
  
export default router;


// GET route that sends the data for a specified combination of learner_id and class_id.
// http://localhost:3000/grades/learner/0?class_id=339

// GET route that sends the weighted average score for each class for a learner.

// GET route that sends the weighted average score for each class for a learner.
// http://localhost:3000/grades/learner/0

// GET route that sends the overall weighted average score for a learner.

// PATCH routes to update the scores array.
// Add a new score.
// Remove a score.

// PATCH route to update class_id.


// DELETE route to remove a single grade entry.

// DELETE route to remove all of a learner's entries.

// DELETE route to remove all of a class's entries.