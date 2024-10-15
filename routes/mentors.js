import express from "express";
import { v4 } from "uuid"
import { db } from "../db-utils/mongoDb-connections.js";
import { mentorModel, studentModel } from "../db-utils/models.js";
import mongoose from "mongoose";

const mentorRouter = express.Router();


mentorRouter.get("/", async (req, res) => {

    try {
        const mentors = await mentorModel.find({}, { _id: 0, __v: 0 });
        console.log(`Mentor: ${mentors}`)
        if (mentors) {
            res.status(200).json({ mentors })
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: "Mentor detail not found" })
    }
})


// 1. Write API to create Mentor
mentorRouter.post("/", async (req, res) => {
    const mentorDetails = req.body;

    const mentorObj = new mentorModel({
        ...mentorDetails,
        id: v4(),
    })
    console.log(mentorObj)

    try {
        await mentorObj.save();
        res.json({ msg: 'Mentor added successfully' })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ msg: "Please Check the fields for Mentor Creation" });
        } else if (error.code === 11000) {
            res.status(400).json({ msg: `Mentor already exists with this Email - ${error.keyValue.email}` })
        } else res.status(500).json({ msg: "Internal Server Error" });

    }
})

// 3. Write API to Assign a student to Mentor
// mentorRouter.put("/:id", async (req, res) => {
//     const mentorId = req.params.id;
//     const studentDetail = req.body;
//     console.log("Student details: " + Object.entries(studentDetail))
//     try {
//         const mentor = await mentorModel.findOne({ id: mentorId })
//         console.log(mentor.students.includes(studentDetail.id))
//         if (mentor) {
//             if (mentor.students.includes(studentDetail.id)) {
//                 res.status(400).json({ msg: 'Student already exists' })
//             } else {

//                 studentDetail.forEach(element => {
//                     mentor.students.push({
//                         id: element.id,
//                         name: element.name,
//                         email: element.email,
//                         currentMentor: element.currentMentor,
//                         previousMentor: element.previousMentor
//                     })

//                 });

//                 studentDetail.forEach(async (element) => {
//                     await studentModel.findByIdAndDelete(element.id)
//                 });

//                 console.log(`Mentor: ${mentor}`)
//                 // const mentorObj = new mentorModel(mentor)
//                 // console.log(`Mentor Obj: ${mentorObj}`)
//                 // const student = await studentModel.findById(studentDetail.id);
//                 // console.log(student)
//                 // const studentList = studentModel.find({});
//                 // studentList.splice(studentIndex, 1);

//                 // await studentModel.findByIdAndDelete(studentDetail.id).then((err, student) => {
//                 //     if (err) return console.error(err);
//                 //     console.log(`Student ${student.name} removed from student collection`);
//                 // })
//                 // await studentList.save();
//                 // const student = await studentModel.find();
//                 // console.log(student)


//                 await mentor.save();
//                 res.status(200).json({ msg: `Student added to mentor - ${mentor.name}` })
//             }
//         }
//     } catch (error) {
//         res.status(404).json({ msg: 'Error in adding student to mentor', error })
//     }
// })

// 3. Write API to Assign a student to Mentor
mentorRouter.put("/:id", async (req, res) => {
    const mentorId = req.params.id;
    const studentDetails = req.body;

    const mentor = await mentorModel.findOne({ id: mentorId });
    console.log(mentor);


    try {
        studentDetails.forEach(async element => {
            console.log(element)
            mentor.students.push({
                ...element,
                previousMentor: (element.currentMentor != '') ? element.currentMentor : '',
                currentMentor: mentor.name
            });
            const stud = await studentModel.findOne({ id: element.id })
            // if (stud.currentMentor != '') stud.previousMentor = stud.currentMentor;
            // stud.currentMentor = mentor.name;
            if (stud) await studentModel.findByIdAndDelete(stud._id)
        })
        await mentor.save();
        res.status(200).json({ msg: 'Students assigned successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Error in assigning students to mentor' })
    }
})

mentorRouter.delete("/:id", async (req, res) => {
    const mentorId = req.params.id;

    try {
        await mentorModel.findByIdAndDelete(mentorId);
        res.status(200).json({ msg: 'Mentor deleted successfully' })
    } catch (error) {
        res.status(500).json({ msg: 'Error in deleting mentor' })
    }
})

// 5. Write API to show all students for a particular mentor
mentorRouter.get("/:id", async (req, res) => {
    const mentorId = req.params.id;
    try {
        const mentor = await mentorModel.findOne({ id: mentorId }, { _id: 0, __v: 0 })
        if (mentor && mentor.students.length != 0) {
            const assignedStudents = mentor.students;
            res.status(200).json({ assignedStudents })
        } else {
            res.status(404).json({ msg: `No students assigned for mentor - ${mentor.name}` })
        }
    } catch (error) {
        res.status(500).json({ msg: 'Mentor details not available' })
    }
})

export default mentorRouter;