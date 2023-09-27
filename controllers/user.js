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
                audience: process.env.GOOGLE_CLIENT_ID, //value jadiin array
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

            res.status(200).json({ access_token: token, dataUser: user })
        } catch (error) {
            next(error)
        }
    }

    static async getUserById(req, res, next) {
        try {
            const id = +req.params.id
            let user = await User.findByPk(id, {
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
            const { name, password, email, phoneNumber } = req.body
            // console.log(req.body)
            // console.log("FILES>>",req)
            const profileImg = 'users/'+req.file.filename

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
            const { amount } = req.body
            const user = await User.findByPk(req.user.id)

            let snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY
            });

            let parameter = {
                "transaction_details": {
                    "order_id": "TRANSACTION_" + Math.floor(10000000 + Math.random() * 9000000) + '_' + req.user.id,
                    "gross_amount": amount
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

            res.status(200).json(midtransToken)
        } catch (error) {
            next(error)
        }
    }

    static async midtransWebhook(req, res, next) {
        const statusResponse = req.body

        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;
        let grossAmount = statusResponse.gross_amount
        let userId = orderId.split('_')[2]

        let totalToken = +grossAmount / 20000

        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'accept') {
                User.increment({ token: totalToken }, { where: { id: userId } })
                return res.status(200).json({ message: "Payment Success" })
            }
        } else if (transactionStatus == 'settlement') {
            User.increment({ token: totalToken }, { where: { id: userId } })
            return res.status(200).json({ message: "Payment Success" })
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            return res.status(200).json({ message: "Payment Failed" })
        } else if (transactionStatus == 'pending') {
            return res.status(200).json({ message: "Payment Pending" })
        }
    }
}

module.exports = UserController