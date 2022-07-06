const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    passwordDigest: { type: String, required: true }
}, { toJSON: { virtuals: true } })

userSchema.virtual("posts", {
    ref: "Post",
    localField: "_id",
    foreignField: "user"
})

module.exports = mongoose.model("User", userSchema)