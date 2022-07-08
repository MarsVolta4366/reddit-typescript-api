const Post = require("../models/post.model")
const posts = require("express").Router()

// Get posts for home page
posts.get("/", async (req, res) => {
    try {
        const foundPosts = await Post.find({}, "-_id").populate("user", "username -_id")
        res.status(200).json(foundPosts)
    } catch {
        res.status(500).json({ message: "There was a problem getting posts" })
    }
})

// Create post
posts.post("/", async (req, res) => {
    try {
        await Post.create({ ...req.body, user: req.session.user_id })
        res.status(200).json({ message: "Post successfully created" })
    } catch {
        res.status(500).json({ message: "There was a problem creating the post" })
    }
})

module.exports = posts