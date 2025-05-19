import express from 'express'
// const express = require('express')
import { DatabaseMemory } from './database-memory.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import auth from './middlewares/auth.js'

const app = express()
const port = 3333

const JWT_SECRET = '7d2252ce729daacce68af4d9af63e62af1e61a7ef8375e6d68d37cb9029991a1'

app.use(express.json()) // Retornos por padrão JSON

app.post('/register', async (req, res) => {
    try {
        const userReq = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(userReq.password, salt)

        const user = DatabaseMemory.create({
            name: userReq.name,
            email: userReq.email,
            password: hashPassword
        })

        res.status(201).json({
            user: user,
            message: 'Usuário criado com sucesso!'
        })
    }
    catch (err) {
        res.status(422).json({
            message: 'Usuário não registrado.',
            error: err.message
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const userReq = req.body

        const user = DatabaseMemory.list(userReq.email)[0]

        if(!user)
            res.status(422).json({
                message: 'Usuário não registrado.'
            })

        const isMatch = await bcrypt.compare(userReq.password, user.password)

        if(!isMatch)
            res.status(400).json({
                message: 'Acesso negado.'
            })

        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1m'})

        res.status(200).json({
            message: 'Logado com sucesso.',
            user: user,
            token: token
        })
    }
    catch(err) {
        res.status(422).json({
            message: 'Usuário não logado.',
            error: err.message
        })
    }
})

app.get('/users', auth, (req, res) => {
    try {
        const users = DatabaseMemory.list()

        res.status(200).json(users)
    }
    catch(err) {
        res.status(422).json({
            message: 'Algo deu errado.',
            error: err.message
        })
    }
})

app.listen(port, () => {
    console.log(`It's alive in ${port}`)
})
