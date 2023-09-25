const { comparePassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const { User } = require('../models')
const midtransClient = require('midtrans-client')
const { OAuth2Client } = require('google-auth-library');

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
            }
            )
            if (!user) throw ({ name: "EmailPasswordInvalid" })

            const isValid = comparePassword(password, user.password)
            if (!isValid) throw ({ name: "EmailPasswordInvalid" })
            const token = signToken({ id: user.id, email: email })
            user = await User.findByPk(user.id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            })

            res.status(200).json({ access_token: token, dataUser: user })
        } catch (error) {
            next(error)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: req.headers.google_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const { email, name } = ticket.getPayload();

            let [user, created] = await User.findOrCreate({
                where: {
                    email: email
                },
                defaults: {
                    email: email,
                    password: String(Math.random()),
                    name: name,
                },
                hooks: false
            })

            const token = signToken({
                id: user.id,
                email: user.email,
            })

            res.status(200).json({ access_token: token, dataUser:user})
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req, res, next) {
        try {
            const id = +req.params.id
            console.log('SINI>>',id, req.user.id)
            if (id !== req.user.id) throw{name:'NotFound'}
            let user = await User.findByPk(req.user.id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password']
                }
            })

            if (!user) {
                throw { name: "NotFound" }
            }

            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async editUser(req, res, next) {
        try {
            const { name, password, email, profileImg, phoneNumber } = req.body
            if (!name || !password || !email) throw ({ name: 'cannotEmpty' })
            const { id } = req.params

            await User.update({ name, email, profileImg, phoneNumber }, { where: { id: id } })

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
                where: { id: id }
            })

            res.status(200).json({ message: `User ${isUser.name} successfully deleted` })
        } catch (error) {
            next(error)
        }
    }

    static async generateMidtransToken(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id)

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });

            let parameter = {
                "transaction_details": {
                    "order_id": "TRANSACTION_" + Math.floor(10000000 + Math.random() * 9000000),
                    "gross_amount": 249000
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    "email": user.email,
                    "name": user.name
                }
            }

            const midtransToken = await snap.createTransaction(parameter)
            await User.increment({ token: 10 }, { where: { id: req.user.id }})

            res.status(200).json(midtransToken)
        } catch (error) {
            next(error)
        }
    }


}

module.exports = UserController