const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { hashPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')


const userData = {
    id:1,
    email: "tesUser@mail.com"
}

const editData = {
    email: "tesUser@mail.com",
    password:"testes",
    name:"berubah"
}

beforeAll(async ()=>{

    let data = require('../db/data.json')
    const dataUser = data.Users.map(el=>{
        delete el.id
        el.password = hashPassword(el.password)
        el.createdAt = new Date()
        el.updatedAt = new Date()
        return el
    })

    await sequelize.queryInterface.bulkInsert('Users',dataUser)

})

afterAll(async ()=>{
    await sequelize.queryInterface.bulkDelete('Users',null,{
        truncate:true,
        cascade:true,
        restartIdentity:true
    })
})
describe('User routes test', ()=>{
    describe('POST /register - register new user ', ()=>{
        it('responds with 201 when success', async ()=>{
            const body = {
                name:'tesHalo',
                email:'tesHalo@mail.com',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(201)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Register account success')
        })

        it('400 failed register - no email inputted', async ()=>{
            const body = {
                name:'tesHalo',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed register - no password inputted', async ()=>{
            const body = {
                name:'tesHalo',
                email:'tesHalo@mail.com'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed register - no name inputted', async ()=>{
            const body = {
                email:'tesHalo@mail.com',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Please fill in all the blank')
        })

        it('400 failed register - Email is not unique', async ()=>{
            const body = {
                name:'tesUser',
                email:'tesUser@mail.com',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Email has been registered')
        })

        it('400 failed register - Email input is not email', async ()=>{
            const body = {
                name:'tesHalo',
                email:'tesUser',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Email input is invalid')
        })
    })

    describe('POST /login - login user', ()=>{
        it('responds with 200 when success', async()=>{
            const body = {
                email: "tesUser@mail.com",
                password: "testes"
            }
            const response = await request(app).post('/users/login').send(body)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('access_token', expect.any(String))

        })

        it('400 failed login - Email input is not email', async ()=>{
            const body = {
                email:'tesUser',
                password:'testes'
            }
            const response = await request(app).post('/users/login').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Invalid email or password')
        })

        it('401 failed login - email/password invalid', async()=>{
            const body = {
                email: "tesUser@mail.com",
                password: "test"
            }
            const response = await request(app).post('/users/login').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message', 'Invalid email or password')

        })
    })

    describe('GET /users/profile/:id - get user by id', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).get('/users/profile/1').set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('id', expect.any(Number))

        })

        it('401 failed get - no token used', async ()=>{
            const response = await request(app).get(`/users/profile/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed get - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).get(`/users/profile/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('404 failed get - item not found', async ()=>{
            userToken = signToken(userData)
            const response = await request(app).get(`/users/profile/10000`).set('access_token',userToken)
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message','Data not found')
        })
    })

    describe('PUT /users/profile/:id - edit user by id', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).put('/users/profile/1').set('access_token',userToken).send(editData)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Your profile has been successfully updated.')

        })


        it('401 failed put- no token used', async ()=>{
            const response = await request(app).put(`/users/profile/1`).send(editData)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed put - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).put(`/users/profile/1`).set('access_token',userToken).send(editData)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('400 failed put - empty name', async()=>{
            userToken = signToken(userData)
            const wrongData = {
                email: "tesUser@mail.com",
                password:"testes"
            }
            const response = await request(app).put('/users/profile/1').set('access_token',userToken).send(wrongData)
            expect(response.status).toBe(400)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', 'Please fill in all the blank')

        })


    })

    describe('DELETE /users/profile/:id - delete user by id', ()=>{
        it('responds with 200 when success', async()=>{
            userToken = signToken(userData)
            const response = await request(app).del('/users/profile/1').set('access_token',userToken)
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty('message', expect.any(String))

        })

        it('401 failed delete - no token used', async ()=>{
            const response = await request(app).del(`/users/profile/1`)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

        it('401 failed delete - invalid token', async ()=>{
            userToken="asal-asalan"
            const response = await request(app).del(`/users/profile/1`).set('access_token',userToken)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message','Authentication Error')
        })

    })

    
})
