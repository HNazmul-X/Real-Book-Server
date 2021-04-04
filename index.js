const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const ObjectId = require("mongodb").ObjectID
require("dotenv").config()
const port = process.env.PORT || 5000


// creating app 
app.use(cors())
app.use(bodyParser.json())


//root api 
app.get("/", (req, res)=>{
    res.send("hello i am ready to use and making app")
})


// contection to mondodb 
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.adky9.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    const bookCollection = client.db("Full-Stack-assingment-Database").collection("Products");
    const orderCollection = client.db("Full-Stack-assingment-Database").collection("orders");


    app.post("/add-books", (req,res)=> {
        bookCollection.insertOne(req.body)
        .then((document) => {
            res.send(document.insertedCount>0)
            console.log(document)
        })
    })


    //all product get api
    app.get("/books", (req, res)=>{
        bookCollection.find({})
        .toArray((err, document)=>{
            console.log(document)
            res.send(document)
        })
    })

    // delete item from database
    app.delete("/delete-book/:bookId", (req,res)=> {
        console.log(req.params.bookId)
        bookCollection.deleteOne({
            _id:ObjectId(req.params.bookId)
        })
        .then(result => res.send(result.deletedCount > 0))
    })

    // specific book by id
    app.get("/book/:bookId", (req, res)=> {
        bookCollection.find({
            _id:ObjectId(req.params.bookId)
        }).toArray((err, document)=> {
            res.send(document[0])
        })
    })
    


    // order  collection post api
    app.post("/place-order/set-item",(req, res)=> {
        orderCollection.insertOne(req.body)
        .then(result => res.send(result.insertedCount> 0))
    })

    // get order information by email name
    app.get("/user-orders/get", (req, res)=> {
        if(req.query){
            orderCollection.find(req.query).toArray((err, result) => {
                res.send(result);
            });
        } else(res.send([]))
    })
});

app.listen(port , ()=> {console.log("app run succesfully")})
