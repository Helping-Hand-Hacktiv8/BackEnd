const { Activity, UserActivity, User, sequelize } = require("../models")
const { Op } = require("sequelize");

class ActivityController {
    static async allActivity(req, res, next) {
        try {
           
            let {latitude, longitude} = req.body
            console.log("latlon", latitude , longitude)
            if (latitude === 'all' || longitude === 'all' || !latitude || !longitude){
                latitude = -6.2082279548177794
                longitude = 106.84599613014322
            }
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
                ],
                where: sequelize.where(sequelize.fn('ST_DWithin',sequelize.col('coordinate'),sequelize.fn('ST_SetSRID',sequelize.fn('ST_MakePoint',longitude, latitude),4326),0.05),true)
            })
            // console.log("PANJANG>>>",activity.length)
            res.status(200).json(activity)
        } catch (error) {
            next(error)
        }
    }

    static async postActivity(req, res, next) {
        try {
            console.log(req.body)
            console.log(req.file)
            const { name, description, fromDate, toDate, participant, reward, location, lat, lon } = req.body
            const photoAct = 'activities/'+req.file.filename
            
            if (!name || !description || !fromDate || !toDate || !participant || !reward || !location || !photoAct) throw ({ name: "cannotEmpty" })
            
            const coordinate = {type:'point',  coordinates: [lon, lat]}
            const newActivity = await Activity.create({name, description, fromDate, toDate, participant, reward, location, coordinate, photoAct, status: "Ongoing" })
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
            console.log(req.body)
            console.log(req.file)
            const { id } = req.params
            const { name, description, fromDate, toDate, participant, reward, location, lat, lon } = req.body
            const photoAct = 'activities/'+req.file.filename

            
            if (!name || !description || !fromDate || !toDate || !participant || !reward || !location || !photoAct ) throw ({ name: "cannotEmpty" })
            const coordinate = {type:'point',  coordinates: [lon, lat]}
            const activity = await Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })

            await Activity.update({name, description, fromDate, toDate, participant, reward, location, coordinate, photoAct},{where:{id:id}})

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
            console.log("ID CANCEL",id)

            const activity = await Activity.findByPk(id)
            if (!activity) throw ({ name: "NotFound" })
            console.log("ACTIVITY", activity)
            const userActivity = await UserActivity.findOne({
                where: {
                    ActivityId: id,
                    UserId: req.user.id,
                    role: "Author"
                }
            })
            console.log("USER ACTIVITY", userActivity)
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
            console.log("ARRAY",arrayUser)
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