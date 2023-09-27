const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { signToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')



const userData = {
    id:1,
    email: "tesUser@mail.com"
}

const newInput=
                {
                    UserId: 1,
                    RewardId: 3,
                    status: "Unclaimed"
                }
let userToken

beforeAll(async ()=>{

    let data = require('../db/data.json')
    const dataUser = data.Users.map(el=>{
        delete el.id
        el.password = hashPassword(el.password)
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

   
    const dataReward = data.Rewards.map(el=>{
        delete el.id
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

    const dataUserReward = data.UserRewards.map(el=>{
        delete el.id
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

    await sequelize.queryInterface.bulkInsert('Users',dataUser)
    await sequelize.queryInterface.bulkInsert('Rewards',dataReward)
    await sequelize.queryInterface.bulkInsert('UserRewards',dataUserReward)

})

afterAll(async ()=>{
    await sequelize.queryInterface.bulkDelete('UserRewards',null,{
        truncate:true,
        cascade:true,
        restartIdentity:true
    })
    await sequelize.queryInterface.bulkDelete('Rewards',null,{
        truncate:true,
        cascade:true,
        restartIdentity:true
    })
    await sequelize.queryInterface.bulkDelete('Users',null,{
        truncate:true,
        cascade:true,
        restartIdentity:true
    })
})
describe('UserRewards routes test', ()=>{
    describe('GET /user-rewards - get all rewards ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/user-rewards`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/user-rewards`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/user-rewards`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })
        
    })

    describe('GET /user-rewards/:id - get a single reward ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/user-rewards/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/user-rewards/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/user-rewards/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed get - data not found', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/user-rewards/1000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message','Data not found')
        })
        
    })

    describe('POST /user-rewards - create a new UserReward ', ()=>{
        it('responds with 201 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/user-rewards`).set('access_token',userToken).send(newInput)
            expect(response.status).toBe(201)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Your reward successfully claimed')
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).post(`/user-rewards`).send(newInput)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).post(`/user-rewards`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed get - AlreadyClaimed', async ()=>{
            userToken = signToken(userData)
            const body=
                {
                    UserId: 1,
                    RewardId: 1,
                    status: "Claimed"
                }
            
            const response = await request(app).post(`/user-rewards`).set('access_token',userToken).send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','You already claimed this reward')
        })
        
    })


})
