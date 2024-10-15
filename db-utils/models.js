import { model, Schema } from "mongoose";

const studentSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    currentMentor: {
        type: String,
    },
    previousMentor: {
        type: String,
    }
})

const mentorSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    students: [studentSchema]
})

export const studentModel = new model("student", studentSchema, "students")
export const mentorModel = new model("mentor", mentorSchema, "mentors")