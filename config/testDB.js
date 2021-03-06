const mongoose = require("mongoose")
const config = require("config")
const db = config.get("testmongoURI")

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    //console.log("mongo connected")
  } catch (err) {
    console.error(err.message + " yes")
    // exit procces with failure
    process.exit(1)
  }
}

module.exports = connectDB
