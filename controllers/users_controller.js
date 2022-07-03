const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const users = require("express").Router()

// User sign up
users.post("/", async (req, res) => {
    try {
        const usernameTaken = await User.findOne({ username: req.body.username })

        if (usernameTaken === null) {
            const newUser = await User.create({ ...req.body, passwordDigest: await bcrypt.hash(req.body.password, 12) })
            req.session.user_id = newUser.id
            res.status(200).json({ username: newUser.username })
        } else {
            res.status(500).json({
                message: "Username is already taken"
            })
        }
    } catch (_err) {
        res.status(500).json({ message: "There was a problem creating the user" })
    }
})

module.exports = users