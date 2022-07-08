const Post = require("../models/post.model")
const posts = require("express").Router()

// Get posts for home page
posts.get("/", async (_req, res) => {
    try {
        const foundPosts = await Post.find({}).populate("user", "username -_id")
        res.status(200).json(foundPosts)
    } catch {
        res.status(500).json({ message: "There was a problem getting posts" })
    }
})

// Get post by id
posts.get("/:postId", async (req, res) => {
    try {
        const foundPost = await Post.findById(req.params.postId).populate("user", "username -_id")
        res.status(200).json(foundPost)
    } catch {
        res.status(500).json({ message: "Couldn't find post with given id" })
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