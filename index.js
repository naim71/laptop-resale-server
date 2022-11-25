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
            const productsCollection = client.db('denGadget').collection('productsList');

            app.get('/categoriesList', async(req, res) =>{
                const query = {};
                const categories = await categoriesCollection.find(query).toArray();
                res.send(categories);
            })
            app.get('/products', async(req, res) =>{
                const query = {};
                const products = await productsCollection.find(query).toArray();
                res.send(products);
            })
            app.get('/products/:categoryId', async(req,res) =>{
                const id = req.params.categoryId;
                const query = {categoryId: id};
                const products = await productsCollection.find(query).toArray();
                res.send(products);
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