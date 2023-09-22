const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const { User } = require('../models')

class UserController {
    static async register(req, res, next) {
        try {
            const { name, password, email } = req.body

            if (!name || !password || !email) throw ({ name: "cannotEmpty" })

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
            const { email, password } = req.body
            if (!email || !password) throw ({ name: "cannotEmpty" })

            let user = await User.findOne({
                where: {
                    email
                }
            })
            if (!user) throw ({ name: "EmailPasswordInvalid" })

            const isValid = comparePassword(password, user.password)
            if (!isValid) throw ({ name: "EmailPasswordInvalid" })

            const token = signToken({ id: user.id, email: email })

            res.status(200).json({ access_token: token, dataUser: user })
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req, res, next) {
        try {
            const { id } = req.params

            let user = await User.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })

            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async editUser(req, res, next) {
        try {
            const { name, email, profileImg, token, phoneNumber } = req.body
            const { id } = req.params

            let user = await User.findByPk(id)

            await user.update({ name, email, profileImg, token, phoneNumber })

            res.status(200).json({ message: `Your profile has been successfully updated.` })
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

            res.status(200).json({ message: `User ${isUser.name} successfully deleted` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController