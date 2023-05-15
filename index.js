const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.0nsziui.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const volunteerCollection = client.db('volunteerDB').collection('volunteer');
        const bookingsCollection = client.db('volunteerDB').collection('bookings');



        // To get All DAta from DB
        app.get('/volunteers', async (req, res) => {
            const cursor = volunteerCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // To get a single Data
        app.get('/volunteers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await volunteerCollection.findOne(query);
            res.send(result);
        })
        // To post a data in DB
        app.post('/volunteers', async (req, res) => {
            const newEvent = req.body;
            // console.log(newEvent);
            const result = await volunteerCollection.insertOne(newEvent);
            res.send(result)
        })
        // Post a booking
        app.post('/bookings', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingsCollection.insertOne(newBooking);
            res.send(result);
        })
        // Get booking according to email pass as query
        app.get('/bookings', async (req, res) => {
            // console.log(req.query);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email };
            }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        })
        // Delete data from DB
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result)
        })
        // Get All user booking info from DB 
        app.get('/users', async (req, res) => {
            const result = await bookingsCollection.find().toArray()
            res.send(result)
        })
        // Patch a data in DB
        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const newDoc = req.body;
            console.log(newDoc);
            const updatedDoc = {
                $set: {
                    status: newDoc.status
                }
            }
            const result = await bookingsCollection.updateOne(filter, updatedDoc);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('CAR SERVICES CENTER IS RUNNING')
});
app.listen(port, () => {
    console.log(`Doctor server is running on port ${port}`);
});