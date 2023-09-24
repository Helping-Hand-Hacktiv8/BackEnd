const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { signToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')



const userData = {
    id:1,
    email: "tesUser@mail.com"
}

const user2 = {
    id: 2,
    name: "tesUser2"
}

const body ={
    UserId:1,
    ActivityId:3,
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

   
    const dataAct = data.Activities.map(el=>{
        delete el.id
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

    const dataUseAct = data.UserActivities.map(el=>{
        delete el.id
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

    await sequelize.queryInterface.bulkInsert('Users',dataUser)
    await sequelize.queryInterface.bulkInsert('Activities',dataAct)
    await sequelize.queryInterface.bulkInsert('UserActivities',dataUseAct)

})

afterAll(async ()=>{
    await sequelize.queryInterface.bulkDelete('UserActivities',null,{
        truncate:true,
        cascade:true,
        restartIdentity:true
    })
    await sequelize.queryInterface.bulkDelete('Activities',null,{
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
describe('UserActivities routes test', ()=>{
    describe('GET /user-activities - get all UserActivities for user ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/user-activities`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/user-activities`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/user-activities`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        
    })

    describe('GET /user-activities/:id - get specific UserActivity by id', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/user-activities/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
        })

        it('401 failed get - no token used', async ()=>{
            const response = await request(app).get(`/user-activities/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/user-activities/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed get - data not found', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/user-activities/100000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message','Data not found')
        })
    })

    describe('POST /user-activities - add new UserActivity', ()=>{
        it('responds with 201 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/user-activities`).set('access_token',userToken).send(body)
            expect(response.status).toBe(201)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Successfully joined a new activity')
        })

        it('401 failed post - no token used', async ()=>{
            const response = await request(app).post(`/user-activities`).send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed post - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).post(`/user-activities`).set('access_token',userToken).send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed post - no ActivityId', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                UserId:1
            }
            const response = await request(app).post(`/user-activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed post - already joined', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                UserId:1,
                ActivityId:2,
            }
            const response = await request(app).post(`/user-activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','You already joined this activity')
        })

        
    })

   
    describe('DELETE /user-activities/:id - delete user activities', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del(`/user-activities/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Successfully exited the activity')
        })

        it('401 failed delete - no token used', async ()=>{
            const response = await request(app).del(`/user-activities/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed delete - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).del(`/user-activities/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed delete - id not in database', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del(`/user-activities/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })
    })
})
