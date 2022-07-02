require("dotenv").config()
const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")
let session = require("express-session")
const MongoStore = require("connect-mongo")
const defineCurrentUser = require("./middleware/defineCurrentUser")

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(defineCurrentUser)

// DB connection
const uri = process.env.MONGO_URI
mongoose.connect(uri)
const connection = mongoose.connection
connection.once("open", () => {
    console.log("Connected to MongoDB")
})

// Express session
app.set("trust proxy", 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: true
    },
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI,
        autoRemove: "interval",
        autoRemoveInterval: 10
    })
}))

// Controllers
app.use("/users", require("./controllers/users_controller"))
app.use("/auth", require("./controllers/auth_controller"))

app.get("/", (_req, res) => {
    res.status(200).send("Welcome to my reddit clone API")
})

app.get("*", (_req, res) => {
    res.status(404).json({ message: "Route not found" })
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})