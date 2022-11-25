const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4evolx3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
            const categoriesCollection = client.db('denGadget').collection('categoriesList');

            const sections = client.db('denGadget').collection('section');

            app.get('/categoriesList', async(req, res) =>{
                const query = {};
                const categories = await categoriesCollection.find(query).toArray();
                res.send(categories);
            })
            







            //section informations
            app.get('/sections', async(req, res) =>{
                const query = {};
                const section = await sections.find(query).toArray();
                res.send(section);
            })
    }
    finally{

    }
}
run().catch(console.log);

app.get ('/', async(req, res) =>{
    res.send('Den Gadget is Running');
})

app.listen(port, () => console.log(`Den Gadget is running on ${port}`))