import express from "express";
import studentRouter from "./routes/students.js";
import { connectToDB } from "./db-utils/mongoDb-connections.js";
import { connectToMongoose } from "./db-utils/moongose-connection.js";
import mentorRouter from "./routes/mentors.js";

const server = express();

server.use(express.json())
server.use("/students", studentRouter)
server.use("/mentors", mentorRouter)

const PORT = 4500;

await connectToDB();
await connectToMongoose();

server.listen(PORT, () => {
    console.log(`Server running at ${PORT}`)
})