const router = require("express").Router()
const User = require("../models/user.model")
const bcrypt = require("bcrypt")

// Log in
router.post("/", async (req, res) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username })

        if (foundUser && await bcrypt.compare(req.body.password, foundUser.passwordDigest)) {
            req.session.user_id = foundUser.id
            res.status(200).json({ username: foundUser.username })
        } else {
            res.status(403).json({ message: "Username or password is incorrect" })
        }
    } catch (_err) {
        res.status(500).json({ message: "There was a problem logging in" })
    }
})

// Send back username if session exists
router.get("/profile", (req, res) => {
    req.currentUser ? res.json({ username: req.currentUser.username }) : res.json(null)
})

// Log out
router.get("/logout", (req, res) => {
    try {
        if (req.session.user_id) {
            req.session.destroy()
            res.clearCookie("connect.sid", { path: "/" })
            res.status(200).json({ message: "Logged out" })
        } else {
            res.status(500).json({ message: "User isn't logged in" })
        }
    } catch {
        res.status(500).json({ message: "There was an issue logging out the user" })
    }
})

module.exports = router
