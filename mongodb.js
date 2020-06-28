const {ObjectID, MongoClient} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id)
console.log(id.getTimestamp())


MongoClient.connect(connectionURL, {useUnifiedTopology: true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database')
    } 
    
    const db = client.db(databaseName)

    // db.collection('users').findOne({name: 'Shivangi', age:22 },(error,user) => {
    //     if(error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })

    db.collection('taskstatus').findOne({_id: ObjectID("5ef4d908f3b4d325298ba247")},(error, task) => {

        console.log(task)
    })

    db.collection('taskstatus').find({completed: false}).toArray((error, task) => {
        console.log(task)
    })

    db.collection('users').updateOne({
        _id: ObjectID("5ef4bcbcf8057321896df45b")
    }, {
        $set: {
            name: 'Aanchal',
            age: 20
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    db.collection('taskstatus').updateMany({
        completed:false
    }, 
        {
            $set: {completed: true}

    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


})