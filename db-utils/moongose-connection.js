import mongoose from "mongoose";

const hostUrl = "127.0.0.1:27017";
const dbName = "fsd58we-tamil-task";
const localUrl = `mongodb://${hostUrl}/${dbName}`
const cloudDbUrl = `mongodb+srv://sriramsrk005:m3YyHyk4fFKV8AKl@cluster0.wtcfb.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

export const connectToMongoose = async () => {
    try {
        // await mongoose.connect(localUrl); // Connected to Mongoose
        await mongoose.connect(cloudDbUrl); // Connected to Mongoose
        console.log("Conected to mongoose")
    } catch (error) {
        console.log("Error in connecting to Mongoose", error);
        process.exit(1)
    }
}