import mongodb from "mongodb";

const localDbUrl = "127.0.0.1:27017"
const dbName = "fsd58we-tamil-task"
const cloudUrl = "mongodb+srv://sriramsrk005:m3YyHyk4fFKV8AKl@cluster0.wtcfb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// local DB url
// export const client = new mongodb.MongoClient(`mongodb://${localDbUrl}`)

// Cloud DB url
export const client = new mongodb.MongoClient(cloudUrl)


export const db = client.db(dbName);

export const connectToDB = async () => {
    try {
        console.log("Connected to DB")
        await client.connect(); // Database connected
    } catch (error) {
        console.log("Error in connecting to DB", error);
        process.exit(1)
    }
}