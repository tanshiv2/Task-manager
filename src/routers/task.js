const express = require('express')
const Task = require('../models/tasks')
const multer = require('multer')

const auth = require('../middleware/auth')

const router = new express.Router()

let uploads = multer()

router.get('/addtask', auth, async (req,res) => {
    res.render('addTask')
})

router.post('/tasks', auth, uploads.fields([]), async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        task.save()
        res.status(201).redirect('/tasks')
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc

router.get('/tasks', auth, async (req,res) => {

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{

        const user = await req.user
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        let arr = []
        const tasksarray = user.tasks
        tasksarray.forEach((task) => {
            task = JSON.stringify(task)
            arr.push(task)
        })
        res.render('tasks', {taskss :arr})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id',auth, async (req,res) => {
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner:req.user._id})
        if (!task){
            return res.status(400).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const ifAllowed = updates.every((update) => allowedUpdates.includes(update))

    if(!ifAllowed){
        res.status(400).send({error: 'Invalid operation!'})
    }

    try{
        const task = await Task.findOne({_id:req.params.id, owner: req.user._id})
        
        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
        if(!task){
            return res.status(400).send()
        }
        res.send(tasks)
    }
    catch (e){
        res.status(500).send(e)
    }
})

module.exports = router