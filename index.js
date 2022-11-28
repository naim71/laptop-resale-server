const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4evolx3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    console.log('token inside', req.headers.authorization);


    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

async function run(){
    try{    //db collections
            const categoriesCollection = client.db('denGadget').collection('categoriesList');

            const sections = client.db('denGadget').collection('section');
            const productsCollection = client.db('denGadget').collection('productsList');

            const bookingsCollection = client.db('denGadget').collection('bookings');

            const usersCollection = client.db('denGadget').collection('users');



            //CRUD operations
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
            //bookings uploading
            app.post('/bookings', async(req,res)=>{
                const booking = req.body;
                console.log(booking);
                const result = await bookingsCollection.insertOne(booking);
                res.send(result);

            })
            //email query in bookings
            app.get('/bookings', verifyJWT, async (req, res) => {
                const email = req.query.email;
                const decodedEmail = req.decoded.email;
    
                if (email !== decodedEmail) {
                    return res.status(403).send({ message: 'forbidden access' });
                }
    
                const query = { email: email };
                const bookings = await bookingsCollection.find(query).toArray();
                res.send(bookings);
            });

            app.get('/booking', async(req, res) =>{
                const query = {};
                const result = await bookingsCollection.find(query).toArray();
                res.send(result);
            })
    
            // app.get('/bookings/:id', async (req, res) => {
            //     const id = req.params.id;
            //     const query = { _id: ObjectId(id) };
            //     const booking = await bookingsCollection.findOne(query);
            //     res.send(booking);
            // })
    

            app.post('/users', async(req,res)=>{
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                res.send(result);

            })
            app.get('/users', async(req, res) =>{
                let query = {};
                if (req.query.email) {
                    query = {
                        email: req.query.email
                    }
                }
                if (req.query.role) {
                    query = {
                        role: req.query.role
                    }
                }
                const result = await usersCollection.find(query).toArray();
                res.send(result);
            })
            
            //checking if user is admin
            app.get('/users/admin/:email', async (req, res) => {
                const email = req.params.email;
                const query = { email }
                const user = await usersCollection.findOne(query);
                res.send({ isAdmin: user?.role === 'admin' });
            })

            //jwt token
            app.get('/jwt', async(req, res) =>{
                const email = req.query.email;
                const query = {email: email}
                const user = await usersCollection.findOne(query);
                if(user){
                    const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '10h'})
                    return res.send({accessToken: token})
                }
                console.log(user);
                res.status(403).send({accessToken: ''})
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