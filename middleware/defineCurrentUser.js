const User = require("../models/user.model")

const defineCurrentUser = async (req, _res, next) => {
    try {
        if (req.session.user_id) {
            const foundUser = await User.findOne({ _id: req.session.user_id })
            req.currentUser = foundUser
            next()
        } else {
            req.currentUser = null
            next()
        }
    } catch (_err) {
        next()
    }
}

module.exports = defineCurrentUser