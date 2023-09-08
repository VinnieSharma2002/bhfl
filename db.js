const mongoose = require("mongoose");

require("dotenv").config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const operationSchema = new mongoose.Schema({
    roll_number: {
        type: String,
        required: true,
    },

    operation_code: {
        type: Number,
        default: 0,
    },
});

const Operation = mongoose.model("Operation", operationSchema);

module.exports = { connectDB, Operation };
