const path = require('path')
const hbs = require('hbs')
const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const cookieParser = require('cookie-parser')
const { request } = require('http')
router.use(cookieParser())

let uploads = multer()

router.get('',(req, res) => {
    res.render('index', {
        title: 'Task Manager',
        name: 'Shivangi Tanwar'
    })
})

//Create user
router.get('/users', async (req,res) => {
    cookie = req.cookies.jwtToken
    if(!cookie){
    res.render('signup')
    }
    else{
        res.redirect('/tasks')
    }
})


router.post('/users', uploads.fields([]), async (req,res) => {
    const user = new User(req.body)

    try{
        const created = await user.save()
        if(created){
        const token = await created.generateAuthToken()
        await res.cookie('jwtToken', token, { maxAge: 18000000, httpOnly: true });
        res.status(201).redirect('/tasks')
        }
    }      
    catch (e) {
        res.status(400).send(e)
    }
})

//Login user
router.get('/login', async (req,res) => {
    cookie = req.cookies.jwtToken
    if(!cookie){
    res.render('login')
    }
    else{
        res.redirect('/tasks')
    }
})

router.post('/users/login', uploads.fields([]), async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.name, req.body.password)
        const token = await user.generateAuthToken()
        await res.cookie('jwtToken', token, { maxAge: 18000000, httpOnly: true });
        console.log(req.cookies.jwtToken)
        res.redirect('/tasks')

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})

//Logout users
router.get('/logout', async (req,res) => {
    const cookie = req.cookies.jwtToken
    if(!cookie){
        res.redirect('/login')
    } else {
        res.render('logout')
    }
})
router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.clearCookie('jwtToken');
        res.send({success: 'Logged out successfuly'})
        // res.redirect('/users/login')
    } catch (e) {
        res.send(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', auth, async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error:'Invalid updates!'})
    }

    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try{
        await req.user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'))
        }
        cb(undefined,true)
    }
    
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res)=> {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined
    req.user.save()
    res.status(200).send()
}, (error, req,res,next) => {
    res.status(400).send({error: 'Failed to delete image'})
})

router.get('/users/:id/avatar', async (req,res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router