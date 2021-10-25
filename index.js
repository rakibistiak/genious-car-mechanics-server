const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xrjhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");
      // create a document to insert
    //   const doc = {
    //     title: "Record of a Shriveled Datum",
    //     content: "No bytes, no problem. Just insert a document, in MongoDB",
    //   }
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    
    // GET API

    app.get('/services', async (req,res)=>{
        const services = await servicesCollection.find({}).toArray();
        res.json(services)

    });

    // GET Single Services
    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const service = await servicesCollection.findOne(query);
        res.json(service)
    })

    //POST API
    app.post('/services', async (req,res)=>{
        const service = req.body;
        console.log('hit the post api via axios', service);
        const result = await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result);
    });


    // DELETE API

    app.delete('/services/:id', async (req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await servicesCollection.deleteOne(query);
        console.log(result);
        res.send(result);
    })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send("I am now Genious car mechanic server")
});
app.listen(port, ()=>{
    console.log('Running my server on port', port);
})