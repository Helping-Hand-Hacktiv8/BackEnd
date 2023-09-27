const { Activity, UserActivity } = require('../models')
const { Op } = require("sequelize");

async function updateActivityAuthorization(req, res, next) {
    try {
        const { id } = req.params

        const activity = await Activity.findByPk(id)
        // console.log('masuk sini',req.user.id,id)
        if (!activity) throw ({ name: "NotFound" })
        
        const userActivity = await UserActivity.findOne({
            where: {
                [Op.and]:[
                    {ActivityId: id},
                    { role: "Author"}
                ]
            }
        })
        // console.log('masuk sana',userActivity.UserId !== req.user.id)
        if (!userActivity || req.user.id !== userActivity.UserId ) throw ({ name: "Forbidden" })

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = updateActivityAuthorization