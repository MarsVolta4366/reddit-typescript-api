const User = require("../models/user.model")

const defineCurrentUser = async (req, _res, next) => {
    try {
        const foundUser = await User.findOne({ id: req.session.user_id })
        req.currentUser = foundUser
        next()
    } catch (_err) {
        next()
    }
}

module.exports = defineCurrentUser