const express = require('express')

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const Client = new MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true});

const bodyParser = require('body-parser');

const app = express();
const port = 3002;

const jsonParser = bodyParser.json();

app.get('/todo',async (req, res) => {
    await Client.connect();
    let db = Client.db('todo')
    let collection = db.collection('task')
    if(req.query.completed === '1') {
        let results = await collection.find({Completed: 1}).toArray();
        res.status(200).json({results})
    } else {
        let results = await collection.find().toArray();
        res.status(200).json({results})
    }
});

// app.get('/todo/completed=1', (req, res) => res.send('get all completed todo'));
// app.get('/todo/completed=0', (req, res) => res.send('get all uncompleted todo'));

app.post('/todo', jsonParser, async (req, res) => {
    await Client.connect();
    let db = Client.db('todo');
    let collection = db.collection('task');
    await collection.insertOne({Task: req.body.task}, (err, result) => {
        res.status(200).json({Added: result.insertedCount})
    });
});

app.put('/todo/:id',async (req, res) => {
    await Client.connect();
    let db = Client.db('todo')
    let collection = db.collection('task')
    let results = await collection.updateOne({_id: ObjectId(req.params.id)}, {$set: {Completed: 1}});
    res.status(200).json({Updated: results.modifiedCount})
});

app.delete('/todo/:id',async (req, res) => {
    await Client.connect();
    let db = Client.db('todo')
    let collection = db.collection('task')
    let results = await collection.deleteOne({_id: ObjectId(req.params.id)});
    res.status(200).json({Deleted: results.deletedCount})
});



app.listen(port);