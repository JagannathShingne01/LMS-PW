import mongoose from "mongoose";


mongoose.set("strictQuery", false);  // if some parameter does not exsist then it will egnore it,not give any error.

const connectionToDB = async () => {
    try{
    const { connection } = await mongoose.connect(
        process.env.MONGO_URI 
    );
    if(connection) {
        console.log(`Connected to MongoDB: ${connection.host}`)
        }
    }catch(e){
        console.log(e);
        process.exit(1);         // terminate the process
    }
}

export default connectionToDB;