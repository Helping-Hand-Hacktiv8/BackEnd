const {User} = require('../models')

class Controller{
    static async postRegister(req,res){
        try {
            const {email,password} = req.body
            const newUser = await User.create({email,password})

            const message =`add user id ${newUser.id} success`
            res.status(201).json({message})
        } catch (error) {
            res.status(500).json({message:error})
        }
    }
}

module.exports = Controller