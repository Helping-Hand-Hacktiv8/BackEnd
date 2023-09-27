const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { signToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')



const userData = {
    id:1,
    email: "tesUser@mail.com"
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

    await sequelize.queryInterface.bulkInsert('Users',dataUser)
    await sequelize.queryInterface.bulkInsert('Rewards',dataReward)

})

afterAll(async ()=>{
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
describe('Rewards routes test', ()=>{
    describe('GET /rewards - get all rewards ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/rewards`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/rewards`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/rewards`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        
    })

    describe('GET /rewards/:id - get a single reward ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/rewards/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
        })

        it('404 failed get - data not found', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/rewards/100000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        it('401 failed get - no token used', async ()=>{
            const response = await request(app).get(`/rewards`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/rewards`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        
    })


})
