require('dotenv').config()
const express = require("express")
// Express body-parser is an npm library used to process data sent through an HTTP request body.
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const { redirect } = require("express/lib/response")

app = express()
// set views
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
// static files
app.use(express.static("public"))


//Database:
//connect to mongodb database
// If todolistDB doesn't exits it will create new one.
mongoose.connect(process.env.MONGO_URI,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("connected to mongodb succesfully")
    }
})

// create schema for todolist items

const itemsSchema = new mongoose.Schema({
    name: String

})

// create table name which will use above schema
// The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name. Thus, for the example below, the model item is for the items collection in the database.
const Item = mongoose.model("item", itemsSchema);


// creating some default items for table/collection named Item

const item1 = new Item({
    name: "Click Add Task to begin typing your task, then press + icon."
});

const item2 = new Item({
    name: "Click on square box to  delete task"
});

// To get todays day
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const d = new Date();
let day = weekday[d.getDay()]; // d.getDay() returns 0-6 integer number.


app.get("/", function (req, res) {

    // let options={
    //     weekday:"long",
    //     year : "numeric",
    //     month : "long" ,
    //     day : "numeric"
    // }

    // let day = new Date()
    // today = day.toLocaleDateString("en-US",options)

    // to get all items use empty {} if you want something particular then you can put condition in it. eg {name:"xyz"}
    Item.find({}, function (err, foundItems) {
        if (foundItems.length == 0) {
            // adding above default items to table named Item

            Item.insertMany([item1, item2], function (err) {
                if (err) { console.log(err) }
                else {
                    console.log("Successfully added items")
                }
            })
            res.redirect("/")
        }
        else {
            res.render("base", { exactDay: day, newItems: foundItems })

        }



    })



})

app.post("/", function (req, res) {
    newTaskName = req.body.taskName
    if (newTaskName.length>0){
        const item = new Item({
            name: newTaskName
        });
        item.save() // to add task in database
    }
   

    res.redirect("/")

})

// delete item when checkbox is checked

app.post("/delete", function(req, res){
checkboxValue=req.body.checkboxVal
// console.log(checkboxValue)
Item.findByIdAndRemove(checkboxValue,function(err){
    if (err){
        console.log(err)
    
    }else 
    {console.log("successfully deleted")}
    res.redirect("/")
    }
    )
})

app.listen(process.env.PORT || 3000, function () {
    console.log("running oN 3000")
});


// To run this app use command node app.js or nodemon app.js or npm start
