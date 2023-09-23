const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { signToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')



const userData = {
    id:1,
    email: "tesUser@mail.com"
}

const body ={
    name:"Bertani", 
    description:"Bertani di dalam kota", 
    fromDate:new Date("2023-10-12"), 
    toDate:new Date("2023-10-14"), 
    participant:5, 
    reward:2, 
    location:"Tebet, Jakarta Pusat", 
    lat:-6.225840, 
    lon:106.856810, 
    photoAct:"https://economicreview.id/wp-content/uploads/2022/02/petani.jpg",
    status:'Active'
}

const actOne ={
    name: "Mencuri hatinya",
    description: "biasalah cinta itu buta",
    fromDate: new Date("2023-10-29"),
    toDate: new Date("2023-12-25"),
    participant: 2,
    reward: 5,
    location: "none",
    lat: 0,
    status: "Active",
    lon: 0,
    photoAct: "https://thumbs.dreamstime.com/z/beautiful-exterior-home-pictures-new-home-design-images-modern-best-house-design-images-best-house-images-images-latest-172194515.jpg"
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

    await sequelize.queryInterface.bulkInsert('Users',dataUser)
    await sequelize.queryInterface.bulkInsert('Activities',dataAct)

})

afterAll(async ()=>{
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
describe('Activities routes test', ()=>{
    describe('GET /activities/:id - get detail id ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/users/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/users/activities/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/users/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed get - item not found', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/users/activities/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        
    })

    describe('GET /activities - fetch all activities', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/users/activities`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/users/activities`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/users/activities`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })
    })

    describe('POST /activities - add new activities', ()=>{
        it('responds with 201 when success', async()=>{
            userToken = signToken(userData)
           
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(body)
            expect(response.status).toBe(201)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','New activity successfully created!')
        })

        it('401 failed post - no token used', async ()=>{
            const response = await request(app).post(`/users/activities`).send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed post - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed post - no name', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                description:"Bertani di dalam kota", 
                fromDate:new Date("2023-10-12"), 
                toDate:new Date("2023-10-14"), 
                participant:5, 
                reward:2, 
                location:"Tebet, Jakarta Pusat", 
                lat:-6.225840, 
                lon:106.856810, 
                photoAct:"https://economicreview.id/wp-content/uploads/2022/02/petani.jpg",
                status:'Active'
            }
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed post - fromDate earlier than current date', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                name:"Bertani",
                description:"Bertani di dalam kota", 
                fromDate:new Date("2023-09-01"), 
                toDate:new Date("2023-10-14"), 
                participant:5, 
                reward:2, 
                location:"Tebet, Jakarta Pusat", 
                lat:-6.225840, 
                lon:106.856810, 
                photoAct:"https://economicreview.id/wp-content/uploads/2022/02/petani.jpg",
                status:'Active'
            }
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','From date must be above current date')
        })

        it('400 failed post - toDate earlier than current date', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                name:"Bertani",
                description:"Bertani di dalam kota", 
                fromDate:new Date("2023-10-12"), 
                toDate:new Date("2023-09-14"), 
                participant:5, 
                reward:2, 
                location:"Tebet, Jakarta Pusat", 
                lat:-6.225840, 
                lon:106.856810, 
                photoAct:"https://economicreview.id/wp-content/uploads/2022/02/petani.jpg",
                status:'Active'
            }
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','To date must be above current date')
        })
    })

    describe('PUT /activities/:id - edit activity', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).put(`/users/activities/1`).set('access_token',userToken).send(actOne)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Activity successfully updated')
        })

        it('404 failed put - id not in database', async()=>{
            userToken = signToken(userData)
            const response = await request(app).put(`/users/activities/10000`).set('access_token',userToken).send(actOne)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        it('401 failed put - no token used', async ()=>{
            const response = await request(app).put(`/users/activities/1`).send(actOne)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed put - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).put(`/users/activities/1`).set('access_token',userToken).send(actOne)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed put - no name', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                description: "biasalah cinta itu buta",
                fromDate: new Date("2023-10-29"),
                toDate: new Date("2023-12-25"),
                participant: 2,
                reward: 5,
                location: "none",
                lat: 0,
                status: "Active",
                lon: 0,
                photoAct: "https://thumbs.dreamstime.com/z/beautiful-exterior-home-pictures-new-home-design-images-modern-best-house-design-images-best-house-images-images-latest-172194515.jpg"
            }
            const response = await request(app).put(`/users/activities/1`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed put - fromDate earlier than current date', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                name: "Mencuri hatinya",
                description: "biasalah cinta itu buta",
                fromDate: new Date("2023-08-29"),
                toDate: new Date("2023-12-25"),
                participant: 2,
                reward: 5,
                location: "none",
                lat: 0,
                status: "Active",
                lon: 0,
                photoAct: "https://thumbs.dreamstime.com/z/beautiful-exterior-home-pictures-new-home-design-images-modern-best-house-design-images-best-house-images-images-latest-172194515.jpg"
            }
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','From date must be above current date')
        })

        it('400 failed get - toDate earlier than current date', async ()=>{
            userToken = signToken(userData)
            const bodyWrong ={
                name: "Mencuri hatinya",
                description: "biasalah cinta itu buta",
                fromDate: new Date("2023-10-29"),
                toDate: new Date("2023-08-25"),
                participant: 2,
                reward: 5,
                location: "none",
                lat: 0,
                status: "Active",
                lon: 0,
                photoAct: "https://thumbs.dreamstime.com/z/beautiful-exterior-home-pictures-new-home-design-images-modern-best-house-design-images-best-house-images-images-latest-172194515.jpg"
            }
            const response = await request(app).post(`/users/activities`).set('access_token',userToken).send(bodyWrong)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','To date must be above current date')
        })
    })

    describe('DELETE /activities/:id - delete activities', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del(`/users/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Activity has been successfully deleted')
        })

        it('401 failed delete - no token used', async ()=>{
            const response = await request(app).del(`/users/activities/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed delete - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).del(`/users/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed delete - id not in database', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del(`/users/activities/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })
    })
})
