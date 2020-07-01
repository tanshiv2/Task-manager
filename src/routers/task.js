const express = require('express')
const Task = require('../models/tasks')

const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20

router.get('/tasks', auth, async (req,res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try{
        const user = await req.user
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
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