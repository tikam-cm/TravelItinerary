const { default: mongoose } = require("mongoose");
require('dotenv').config();

const connectDb = async () => {
    try {
        console.log(process.env.CONNECTION_STRING);
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`Connection established: with ${connect.connection.host} ${connect.connection.name}`)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connectDb;