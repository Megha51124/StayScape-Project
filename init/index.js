const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");


const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("DB Connected Successfully for Seeding");
    console.log("Connected to:", dbUrl);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});

    initdata.data
     = initdata.data.map((obj) => ({
        ...obj,
        owner: "69a1cda42348e6f3a3d0a6af",
    }));

    await Listing.insertMany(initdata.data);
    console.log("Data was Initialized");
};
initDB();