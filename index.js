const express = require("express");
const validator = require("validator");
const { connectDB, Operation } = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load env
require("dotenv").config();

// connect to database
connectDB();

// load models

app.get("/bfhl", async (req, res) => {
    try {
        const data= await Operation.findOne({
            roll_number: "RA2011003010790",
        });
        if (!data) throw new Error("Invalid Operation Code");
        return res.status(200).json({
            operation_code:data.operation_code,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err ? err : "Internal Server Error",
        });
    }
});

app.post("/bfhl", async (req, res) => {
    // my info
    const user_id = "vinnie_sharma_02112002";
    const email = "vs2595@srmist.edu.in";
    const roll_number = "RA2011003010790";

    // data
    let alphabets = [];
    let numbers = [];

    try {
        let resp = await Operation.findOne({ roll_number: "RA2011003010790" });
        
        if (resp && resp.operation_code) {
            resp.operation_code++;
            await resp.save();
        } else {
            const operation = new Operation({
                roll_number,
                operation_code: 1,
            });
            await operation.save();
        }

        const { data } = req.body;
        await data.forEach((item) => {
            if (validator.isAlpha(item)) alphabets.push(item);
            else if (validator.isNumeric(item)) numbers.push(item);
            else throw new Error("Invalid Data");
        });
        return res.status(200).json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
        });
    } catch (err) {
        console.error("errr",err);
        return res.status(400).json({
            is_success: false,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets,
        });
    }
});

app.get("*", (req, res) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
