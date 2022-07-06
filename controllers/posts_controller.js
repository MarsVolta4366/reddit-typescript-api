const Post = require("../models/post.model")
const posts = require("express").Router()

// Create post
// Post won't be created unless {user: ""} field is provided with a valid existing user id
posts.post("/", async (req, res) => {
    try {
        await Post.create(req.body)
        res.status(200).json({ message: "Post successfully created" })
    } catch {
        res.status(500).json({ message: "There was a problem creating the post" })
    }
})

module.exports = posts