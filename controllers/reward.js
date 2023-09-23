const { Reward } = require('../models')

class RewardController {
    static async getReward(req, res, next) {
        try {
            const reward = await Reward.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            res.status(200).json(reward)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = RewardController