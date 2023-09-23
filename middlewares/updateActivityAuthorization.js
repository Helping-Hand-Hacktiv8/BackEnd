const { Activity, UserActivity } = require('../models')

async function updateActivityAuthorization(req, res, next) {
    try {
        const { id } = req.params

        const activity = await Activity.findByPk(id)

        if (!activity) throw ({ name: "NotFound" })
        
        const userActivity = await UserActivity.findOne({
            where: {
                UserId: req.user.id,
                ActivityId: id,
                role: "Author"
            }
        })
        
        console.log("sampe sini 20");
        if (!userActivity || userActivity.role != "Author") throw ({ name: "Forbidden" })

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = updateActivityAuthorization