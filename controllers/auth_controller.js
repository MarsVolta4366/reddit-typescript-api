const router = require("express").Router()
const User = require("../models/user.model")
const bcrypt = require("bcrypt")

// Log in
router.post("/", async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username })

        if (foundUser && await bcrypt.compare(req.body.password, foundUser.passwordDigest)) {
            res.json({ message: "Logged in" })
        } else {
            res.status(404).json({ message: "Username or password is incorrect" })
        }
    } catch (_err) {
        res.status(500).json({ message: "There was a problem logging in" })
    }
})

module.exports = router
