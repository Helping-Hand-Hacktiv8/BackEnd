const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { hashPassword } = require('../helpers/bcrypt')


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
            expect(response.body).toHaveProperty('id', expect.any(Number))
        })

        it('400 failed register - no email inputted', async ()=>{
            const body = {
                name:'tesHalo',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Email/Password is required')
        })

        it('400 failed register - no password inputted', async ()=>{
            const body = {
                name:'tesHalo',
                email:'tesHalo@mail.com'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Email/Password is required')
        })

        it('400 failed register - no name inputted', async ()=>{
            const body = {
                email:'tesHalo@mail.com',
                password:'testes'
            }
            const response = await request(app).post('/users/register').send(body)
            expect(response.status).toBe(400)
            expect(response.body).toHaveProperty('message','Name is required')
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

        it('responds with 401 when password invalid', async()=>{
            const body = {
                email: "tesUser@mail.com",
                password: "test"
            }
            const response = await request(app).post('/users/login').send(body)
            expect(response.status).toBe(401)
            expect(response.body).toHaveProperty('message', 'Invalid email/password')

        })
    })
})
