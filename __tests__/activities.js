const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { signToken } = require('../helpers/jwt')
const { hashPassword } = require('../helpers/bcrypt')
const { Sequelize } = require('sequelize')

let data = require('../db/data.json')


const userData = {
    id:1,
    email: "tesUser@mail.com"
}

const user2 = {
    id: 2,
    name: "tesUser2"
}

const body ={
    name:"Bertani", 
    description:"Bertani di dalam kota", 
    fromDate:new Date("2023-10-12"), 
    toDate:new Date("2023-10-14"), 
    participant:5, 
    reward:2, 
    location:"Tebet, Jakarta Pusat", 
    coordinate: Sequelize.fn('ST_GeomFromText',`POINT(-6.225840 106.856810)`,4326),
    photoAct:"https://economicreview.id/wp-content/uploads/2022/02/petani.jpg",
    status:'Ongoing'
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
    status: "Ongoing",
    lon: 0,
    photoAct: "https://thumbs.dreamstime.com/z/beautiful-exterior-home-pictures-new-home-design-images-modern-best-house-design-images-best-house-images-images-latest-172194515.jpg"
}

let userToken

beforeAll(async ()=>{
    try{

    

    const dataUser = data.Users.map(el=>{
        delete el.id
        el.password = hashPassword(el.password)
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

   
    const dataAct = data.Activities.map(el=>{
        delete el.id
        el.coordinate = sequelize.fn('ST_GeomFromText',`POINT(${el.lon} ${el.lat})`,4326)
        delete el.lat
        delete el.lon
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
    } catch(err){
        console.log("ERROR>>>>",err)
    }
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
describe('Activities routes test', ()=>{
    describe('GET /activities/:id - get detail id ', ()=>{
        it('responds with 200 when success', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
          
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).get(`/activities/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed get - item not found', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/activities/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        
    })

    describe('POST /activities/all - fetch all activities', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/activities/all`).set('access_token',userToken).send({latitude:'all', longitude:'all'})
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
        })

        it('401 failed get - no token used', async ()=>{
           
            const response = await request(app).post(`/activities/all`).send({latitude:'all', longitude:'all'})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).post(`/activities/all`).set('access_token',userToken).send({latitude:'all', longitude:'all'})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })
    })

    describe('POST /activities - add new activities', ()=>{
        it('responds with 201 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/activities`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(201)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','New activity successfully created!')
        })

        it('401 failed post - no token used', async ()=>{
            const response = await request(app).post(`/activities`).send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed post - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).post(`/activities`).set('access_token',userToken).send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed post - no name', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/activities`).set('access_token',userToken)
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed post - fromDate earlier than current date', async ()=>{
            userToken = signToken(userData)
  
            const response = await request(app).post(`/activities`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-08-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','From date must be above current date')
        })

        it('400 failed post - toDate earlier than current date', async ()=>{
            userToken = signToken(userData)

            const response = await request(app).post(`/activities`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-08-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','To date must be above current date')
        })
    })

    describe('PUT /activities/:id - edit activity', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).put(`/activities/1`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Activity successfully updated')
        })

        it('403 failed put - status not author', async()=>{
            userToken = signToken(user2)
            const response = await request(app).put(`/activities/1`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(403)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Access Forbidden')
        })

        it('404 failed put - id not in database', async()=>{
            userToken = signToken(userData)
            const response = await request(app).put(`/activities/10000`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        it('401 failed put - no token used', async ()=>{
            const response = await request(app).put(`/activities/1`).send(actOne)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed put - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).put(`/activities/1`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed put - no name', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).put(`/activities/1`).set('access_token',userToken)
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed put - fromDate earlier than current date', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/activities`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-08-12").toISOString())
            .field('toDate',new Date("2023-10-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','From date must be above current date')
        })

        it('400 failed get - toDate earlier than current date', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).post(`/activities`).set('access_token',userToken)
            .field('name','Bertani')
            .field('description','Bertani di dalam kota')
            .field('fromDate',new Date("2023-10-12").toISOString())
            .field('toDate',new Date("2023-08-14").toISOString())
            .field('participant',5)
            .field('reward',2)
            .field('location','Tebet, Jakarta Pusat')
            .field('lon', 106.856810)
            .field('lat',-6.225840 )
            .attach('photoAct','./public/users/profile-1.jpg')
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','To date must be above current date')
        })
    })

    describe('PATCH /activities/cancel/:id - cancel activities', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).patch(`/activities/cancel/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Activity has been cancelled')
        })

        it('401 failed patch- no token used', async ()=>{
            const response = await request(app).patch(`/activities/cancel/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed patch - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).patch(`/activities/cancel/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('403 failed patch - forbidden access', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).patch(`/activities/cancel/2`).set('access_token',userToken)
            expect(response.status).toBe(403)
            expect(response.body).toHaveProperty('message','Access Forbidden')
        })

        it('404 failed patch - id not in database', async()=>{
            userToken = signToken(userData)
            const response = await request(app).patch(`/activities/cancel/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        
    })

    describe('PUT /activities/finish/:id - finish activities and pay', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const arrayUser=[
                {UserId:1,
                    ActivityId:1,
                    role:'Participant'}]
            const response = await request(app).put(`/activities/finish/1`).set('access_token',userToken).send({arrayUser})
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Activity finished')
        })

        it('401 failed patch- no token used', async ()=>{
            const arrayUser=[
                {UserId:1,
                    ActivityId:1,
                    role:'Participant'}]
            const response = await request(app).put(`/activities/finish/1`).send({arrayUser})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed patch - invalid token', async ()=>{
            userToken="asal-asalan"
            const arrayUser=[
                {UserId:1,
                    ActivityId:1,
                    role:'Participant'}]
            const response = await request(app).put(`/activities/finish/1`).set('access_token',userToken).send({arrayUser})
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })


        it('404 failed patch - id not in database', async()=>{
            userToken = signToken(userData)
            const arrayUser=[
                {UserId:1,
                    ActivityId:1,
                    role:'Participant'}]
            const response = await request(app).put(`/activities/finish/10000`).set('access_token',userToken).send({arrayUser})
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })

        
    })

    describe('DELETE /activities/:id - delete activities', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del(`/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Activity has been successfully deleted')
        })

        it('401 failed delete - no token used', async ()=>{
            const response = await request(app).del(`/activities/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed delete - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).del(`/activities/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed delete - id not in database', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del(`/activities/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message','Data not found')
        })
    })

    
})
