require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

// DB connection
const uri = process.env.MONGO_URI
mongoose.connect(uri)
const connection = mongoose.connection
connection.once("open", () => {
    console.log("Connected to MongoDB")
})

// Controllers
app.use("/users", require("./controllers/users_controller"))

app.get("/", (_req, res) => {
    res.status(200).send("Welcome to my reddit clone API")
})

app.get("*", (_req, res) => {
    res.status(404).json({ message: "Route not found" })
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})