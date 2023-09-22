const { Activity } = require("../models")

class ActivityController {
    static async allActivity(req, res, next) {
        try {
            const activity = await Activity.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            res.status(200).json(activity)
        } catch (error) {
            next(error)
        }
    }

    static async postActivity(req, res, next) {
        try {
            const { name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct } = req.body

            if (!name || !description || !fromDate || !toDate || !participant || !reward || !location || !photoAct) throw ({ name: "cannotEmpty" })

            await Activity.create(name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct)

            res.status(201).json({ message: "New activity successfully created!" })
        } catch (error) {
            next(error)
        }
    }

    static async updateActivity(req, res, next) {
        try {
            const { id } = req.params
            const { name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct } = req.body
            
            if (!name || !description || !fromDate || !toDate || !participant || !reward || !location || !photoAct) throw ({ name: "cannotEmpty" })

            const activity = Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            await activity.update(name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct)

            res.status(200).json({ message: "Activity successfully updated" })
        } catch (error) {
            next(error)
        }
    }

    static async getActivityDetail(req, res, next) {
        try {
            const { id } = req.params

            const activity = await Activity.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            if (!activity) throw ({ name: "NotFound" })

            res.status(200).json(activity)
        } catch (error) {
            next(error)
        }
    }

    static async deleteActivity(req, res, next) {
        try {
            const { id } = req.params

            const activity = Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            await activity.destroy({ where: { id }})

            res.status(200).json({ message: "Activity has been successfully deleted" })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ActivityController