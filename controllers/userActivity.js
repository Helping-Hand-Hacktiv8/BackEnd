const { UserActivity, Activity, User } = require('../models')

class UserActivityController {
    static async getUserActivity(req, res, next) {
        try {
            const userActivity = await UserActivity.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: Activity,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                    },
                    {
                        model: User,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'password']
                        },
                    }
                ],
                where: { UserId: req.user.id }
            })

            if (userActivity.length == 0) {
                return res.status(200).json({ message: "You are not joined an activity yet" })
            }

            res.status(200).json(userActivity)
        } catch (error) {
            next(error)
        }
    }

    static async userActivityDetail(req, res, next) {
        try {
            const { id } = req.params

            const userActivity = await UserActivity.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: Activity,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                    },
                    {
                        model: User,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'password']
                        },
                    }
                ],
                where: { UserId: req.user.id }
            })

            if (!userActivity) throw ({ name: "NotFound" })

            res.status(200).json(userActivity)
        } catch (error) {
            next(error)
        }
    }

    static async postUserActivity(req, res, next) {
        try {
            const { ActivityId } = req.body

            if (!ActivityId) throw ({ name: "cannotEmpty" })

            const isJoin = await UserActivity.findOne({
                where: {
                    UserId: req.user.id,
                    ActivityId: ActivityId
                }
            })
            if (isJoin) throw ({ name: "AlreadyJoin" })

            await UserActivity.create({ UserId: req.user.id, ActivityId, role: "Participant" })

            res.status(201).json({ message: "Successfully joined a new activity" })
        } catch (error) {
            next(error)
        }
    }

    static async deleteUserActivity(req, res, next) {
        try {
            const { id } = req.params

            const isUserActivity = await UserActivity.findByPk(id)
            if (!isUserActivity) throw ({ name: "NotFound" })

            await UserActivity.destroy({ where: { id }})

            res.status(200).json({ message: "Successfully exited the activity" })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserActivityController