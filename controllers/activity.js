const { Activity, UserActivity, User } = require("../models")
const { Op } = require("sequelize");

class ActivityController {
    static async allActivity(req, res, next) {
        try {
            const activity = await Activity.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [
                    { 
                        model: UserActivity,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                    }
                ]
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

            const newActivity = await Activity.create({name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct, status: "Ongoing" })
            await UserActivity.create({
                UserId: req.user.id,
                ActivityId: newActivity.id,
                Status: "Ongoing",
                role: "Author"
            })

            res.status(201).json({ message: "New activity successfully created!" })
        } catch (error) {
            next(error)
        }
    }

    static async updateActivity(req, res, next) {
        try {
            const { id } = req.params
            const { name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct, status } = req.body
            
            if (!name || !description || !fromDate || !toDate || !participant || !reward || !location || !photoAct || !status) throw ({ name: "cannotEmpty" })

            const activity = await Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            await Activity.update({name, description, fromDate, toDate, participant, reward, location, lat, lon, photoAct, status},{where:{id:id}})

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
                },
                include: [
                    { 
                        model: UserActivity,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                    }
                ]
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

            const activity = await Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            await Activity.destroy({ where: { id }})

            res.status(200).json({ message: "Activity has been successfully deleted" })
        } catch (error) {
            next(error)
        }
    }

    static async cancelActivity(req, res, next) {
        try {
            const { id } = req.params

            const activity = await Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            const userActivity = await UserActivity.findOne({
                where: {
                    ActivityId: id,
                    UserId: req.user.id,
                    role: "Author"
                }
            })
            if (!userActivity) throw ({ name: "Forbidden" })

            await Activity.update({ status: "Cancelled" }, { where: { id }})

            res.status(200).json({ message: "Activity has been cancelled" })
        } catch (error) {
            next(error)
        }
    }

    static async finishActivity(req, res, next) {
        try {
            //id activity
            const { id } = req.params
            //get arrayUser from author input
            const { arrayUser} = req.body
            
            //sample arrayUser for postman testing, comment above and uncomment below
            // const arrayUser =[{
            //     UserId:1,
            //     ActivityId:1,
            //     role:'Participant'
            // }]

            const activity = await Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            //looping through array of admitted participants
            for (let arr of arrayUser){
                let checkUser = await User.findByPk(arr.UserId)
                if (!checkUser) throw{name:'NotFound'}
                await User.increment('token', {by: activity.reward, where:{id:arr.UserId}})
            }

            //decrement token from author
            const totalToken = activity.reward * arrayUser.length
            await User.decrement('token',{by: totalToken, where:{id:req.user.id}} )

            await activity.update({ status: "Done" })

            res.status(200).json({ message: "Activity finished" })


            // const userActivity = await UserActivity.findAll({
            //     where: { ActivityId: id, role: "Participant" }
            // })
            // if (!userActivity) throw ({ name: "NotFound" })
            // const idUser = userActivity.map(el => el.UserId)

            // const participant = await User.findAll({
            //     where: {
            //         id: idUser
            //     },
            //     attributes: {
            //         exlude: ['createdAt', 'updatedAt', 'password']
            //     }
            // })

            // await participant.update({ token: +  activity.reward })
           
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ActivityController