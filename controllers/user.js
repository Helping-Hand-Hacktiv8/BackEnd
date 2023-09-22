const { User } = require('../models')

class UserController {
    static async register(req, res, next) {
        try {
            const { name, password, email } = req.body


            await User.create({
                name, email, password, token: 0
            })

            res.status(201).json({ message: "Register account success" })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const input = req.body

            res.status(200).json(input)
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req, res, next) {
        try {
            const { id } = req.params

            let user = await User.findByPk(id)

            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async editUser(req, res, next) {
        try {
            const input = req.body
            const { id } = req.params


            res.status(200).json({ input, id })
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params

            const isUser = await User.findByPk(id)
            if (!isUser) throw ({ name: "NotFound" })

            await User.destroy({
                where: { id }
            })

            res.status(200).json({ message: `User ${isUser.name} successfully deleted`})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController