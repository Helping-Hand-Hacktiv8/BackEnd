const { UserReward, Reward, User } = require('../models')

class UserRewardController {
    static async getAll(req, res, next) {
        try {
            const userReward = await UserReward.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: Reward,
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

            res.status(200).json(userReward)
        } catch (error) {
            next(error)
        }
    }

    static async getDetail(req, res, next) {
        try {
            const { id } = req.params

            const userReward = await UserReward.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    {
                        model: Reward,
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

            if (!userReward) throw ({ name: "NotFound" })

            res.status(200).json(userReward)
        } catch (error) {
            next(error)
        }
    }

    static async claimReward(req, res, next) {
        try {
            const { RewardId } = req.body

            if (!RewardId) throw ({ name: "cannotEmpty" })

            const isClaimed = await UserReward.findOne({
                where: {
                    UserId: req.user.id,
                    RewardId: RewardId
                }
            })
            if (isClaimed) throw ({ name: "AlreadyClaimed" })
            
            const getReward = await Reward.findByPk(RewardId)

            await UserReward.create({ UserId: req.user.id, RewardId, status: "Pending" })
            await User.decrement('token',{by: getReward.price, where:{id:req.user.id}})

            res.status(201).json({ message: "Your reward successfully claimed" })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserRewardController