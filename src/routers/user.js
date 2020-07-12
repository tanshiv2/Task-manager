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
const { sendWelcomeEmail } = require('../emails/account') 
const { sendCancelEmail } = require('../emails/account')
router.use(cookieParser())

let uploads = multer()

router.get('',(req, res) => {
    res.redirect('/login')
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
        sendWelcomeEmail(user.email,user.name)
        res.status(201).redirect('/tasks')
        }
    }      
    catch (e) {
        // res.status(400).send(e)
        res.send(e.message)
        // res.render('signup', {})
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
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await res.cookie('jwtToken', token, { maxAge: 18000000, httpOnly: true });
        console.log(req.cookies.jwtToken)
        res.redirect('/tasks')

    } catch (e) {
        res.status(400).render('login', {errormsg: e.message})
        // res.send(e)
    }
})

router.get('/users/me', auth, async (req,res) => {
    res.render('user', {
        user: req.user.name,
        email: req.user.email,
        age: req.user.age,
        avatar: req.user.avatar})
})

router.get('/users/update', auth, async (req,res) => {
    res.render('updateUser', {
        user: req.user.name,
        email: req.user.email,
        age: req.user.age,
        })
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
        // res.redirect('login', {success: 'Logged out successfuly'})
        res.redirect('/login')
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
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try{
        sendCancelEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.clearCookie('jwtToken')
        // res.redirect('/users')
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
    res.status(200).redirect('/users/me')
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

router.get('/users/me/avatar', auth, async (req,res) => {
    try{
        const user = await User.findById(req.user.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
        // res.render('avatar', {avatar: user.avatar})
    } catch (e) {
        const url = 'http://simpleicon.com/wp-content/uploads/user1-256x256.png'
        var image = new Buffer(url,'binary')
        res.set('Content-Type', 'image/png')
        res.send(image)
        // res.status(404).send()
    }
})

router.get('/users/me/passchange', auth, async (req,res) => {
    try{
        res.render('passchange')
    } catch {
        res.render('/users/me', {msg: 'Current password is incorrect!'})
    }
})

router.post('/users/me/passchange', uploads.fields([]), auth, async (req,res) => {
    console.log(req.user.email, req.body.password, req.body.newpassword)
    try{
        
        const user = await User.findByCredentials(req.user.email, req.body.password)
        user.password = req.body.newpassword
        console.log(user.password)
        await user.save()
        await req.user.save()
        console.log(user)
        res.status(200).redirect('/users/me')
    } catch (e) {
        // res.status(400).send(e)
        res.redirect('/users/me')
    }
 })

 router.get('/users/*', auth,(req,res) => {

    res.render('404u', { 
        error: 'User page not found'
    })
})

module.exports = router