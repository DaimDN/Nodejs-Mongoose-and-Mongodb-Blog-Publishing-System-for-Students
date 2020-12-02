const { rejects } = require('assert');
const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');


var url = "mongodb+srv://root:0995@nodejs.2j0z7.mongodb.net/database";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;
db.once('open', function(){
    console.log("Connected to the Databases")
})

const BlogSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    date: String,
    tags: String,
    key: String

})

const BlogModel = mongoose.model('articles', BlogSchema);


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    var data = BlogModel.find({}, function(err, docs){
        if(err) throw err;
        res.render('display', {items: docs});
    })
})

app.post('/add', (req, res)=>{
    var {title, description, image, date, tags, key}  = req.body;
    var dateObj = new Date;
    var currentDate = dateObj.toUTCString();
    date = currentDate;
    key = Date.now();
    var Objects = {title, description, image, date , tags , key};
   
    const Datatobestored = new BlogModel(Objects);
    Datatobestored.save();
    res.json(Datatobestored);
})


app.post('/edit', (req, res)=>{
    var {title, description, image, tags, key}  = req.body;
    var query = {title, description, image, tags};
   
    BlogModel.findOneAndUpdate({key: Number(key)}, query, function(err, result){
        if(err) throw err;
        res.redirect('/');
    })
   
})



app.get('/add', function(req, res){
    res.render('add');
})

app.post('/delete', (req, res)=>{
    var selected = req.body.selected;
    selected = Number(selected);
    console.log(selected);
    
    BlogModel.deleteOne({key : selected}, (err)=>{
        if (err) throw err;
        res.redirect('/');
    })
   
})

app.post('/view', function(req, res){
   var {target} = req.body;
   
})


app.get('/view/:key', function(req, res){
    var {key} = req.params;
   
   BlogModel.findOne({key: Number(key)}, (err, docs)=>{
       if(err) throw err;
       
       res.render('view', {items: docs})
   })
})

app.get('/edit/:key', function(req, res){
    var {key} = req.params;
   
   BlogModel.findOne({key: Number(key)}, (err, docs)=>{
       if(err) throw err;
       
       res.render('edit', {data: docs})
   })
})



app.post('/search', (req, res)=>{
    var {query} = req.body;

    BlogModel.findOne({query, })
})


app.listen(port, ()=> {
    console.log("Server is running");
});