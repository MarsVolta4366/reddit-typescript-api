const Post = require("../models/post.model")
const User = require("../models/user.model")
const posts = require("express").Router()

// Get post by id
posts.get("/showPost/:postId", async (req, res) => {
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
        const newPost = await (await Post.create({ ...req.body, user: req.session.user_id })).populate("user", "username -_id")
        res.status(200).json(newPost)
    } catch {
        res.status(500).json({ message: "There was a problem creating the post" })
    }
})

// Delete post by post id if user who created the post is logged in
posts.delete("/:postId", async (req, res) => {
    try {
        const postToDelete = await Post.findById(req.params.postId).populate("user")

        if (req.session.user_id.toString() === postToDelete.user._id.toString()) {
            await Post.findByIdAndDelete(req.params.postId)
            res.status(200).json({ message: "Post successfully deleted" })
        } else {
            res.status(500).json({ message: "There was a problem deleting the post" })
        }
    } catch {
        res.status(500).json({ message: "There was a problem deleting the post" })
    }
})

// Update post by post id if user who created the post is logged in
posts.put("/:postId", async (req, res) => {
    try {
        const postToUpdate = await Post.findById(req.params.postId).populate("user")

        if (req.session.user_id.toString() === postToUpdate.user._id.toString()) {
            await Post.findByIdAndUpdate(req.params.postId, req.body)
            res.status(200).json({ message: "Post successfully edited" })
        } else {
            res.status(500).json({ message: "Not authorized" })
        }
    } catch {
        res.status(500).json({ message: "There was a problem updating the post" })
    }
})

// Get posts by username
posts.get("/user/:username/:offset", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const usersPosts = await Post.find({ user: user._id }).populate("user", "username -_id").skip(req.params.offset).limit(10)
        const totalPosts = await Post.count({ user: user._id })
        res.status(200).json({ data: [...usersPosts], totalPosts })
    } catch {
        res.status(500).json({ message: "There was a problem getting users posts" })
    }
})

// Get posts for home page
posts.get("/:offset", async (req, res) => {
    try {
        const foundPosts = await Post.find({}).populate("user", "username -_id").skip(req.params.offset).limit(10)
        const totalPosts = await Post.count()
        res.status(200).json({ data: [...foundPosts], totalPosts })
    } catch {
        res.status(500).json({ message: "There was a problem getting posts" })
    }
})

module.exports = posts