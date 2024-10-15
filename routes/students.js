import express from "express";
import { studentModel } from "../db-utils/models.js";
import { v4 } from "uuid"
import { db } from "../db-utils/mongoDb-connections.js";
import mongoose from "mongoose";

const studentRouter = express.Router();

studentRouter.get("/", async (req, res) => {
    try {
        const students = await studentModel.find({}, { _id: 0, __v: 0 });

        if (students) {
            res.status(200).json({ students })
        }
    } catch (error) {
        res.status(404).json({ msg: "Student detail not found" })
    }
})

// 2. Write API to create Student
studentRouter.post("/", async (req, res) => {

    const studentDetails = req.body;
    // console.log(`Student details: ${studentDetails}`)

    const studentObj = new studentModel({
        id: v4(),
        ...studentDetails
    })
    try {
        await studentObj.save();
        res.json({ msg: "Student Created SUccessfully" });
    } catch (e) {
        console.log("Error in creating student", e);
        if (e instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ msg: "Please Check the fields for Student Creation" });
        } else if (e.code === 11000) {
            res.status(400).json({ msg: `Student already exists with this Email - ${e.keyValue.email}` })
        } else res.status(500).json({ msg: "Internal Server Error" });
    }
})

// 4. Write API to Assign or Change Mentor for particular Student
studentRouter.put("/:id", async (req, res) => {
    const studentId = req.params.id;
    const mentor = req.body

    const student = await studentModel.findOne({ id: studentId });
    try {
        if (student) {
            if (student.currentMentor === '') student.currentMentor = mentor.name;
            else {
                student.previousMentor = student.currentMentor;
                student.currentMentor = mentor.name
            }
        }
        await student.save()
        res.json({ msg: "Mentor added/modified succesfully" })
    } catch (error) {
        res.status(404).json({ msg: 'Error in adding mentor' })
    }

})

// 6. Write an API to show the previously assigned mentor for a particular student.
studentRouter.get("/:id/previous-mentor", async (req, res) => {
    const studentId = req.params.id;
    const student = await studentModel.findOne({ id: studentId });

    try {
        if (student && student.previousMentor != '') {
            res.json({ previousMentor: student.previousMentor })
        } else {
            res.status(404).json({ msg: "Student not found" })
        }
    } catch (error) {
        res.status(404).json({ msg: "Error in retrieving Student" })
    }
})

export default studentRouter;
