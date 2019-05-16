'use strict';
require('dotenv').config();
const path = require("path");
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');
const utils = require('./libs/utils');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.catch((err)=>{console.log(err); process.exit(1)});
      
let UrlSchema = new Schema({
  _id: {type:String, required:true},
  originalUrl: {type:String, required:true},
});

let UrlModel = mongoose.model('Url', UrlSchema, 'urls');



let app = express();

// Basic Configuration 
let port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(process.cwd(),'/public')));

/*endpoint de pagina index*/
app.get('/', function(req, res){
  res.sendFile(path.join(process.cwd(), '/views/index.html'));
});
 
/*endpoint de redirección*/
app.get("/api/shorturl/:id", (req,res)=>{
  UrlModel.findById(req.params.id)
  .then((data)=>{
    res.redirect(data.originalUrl);   
  })  
});

/*endpoint de acortado de url*/
app.post("/api/shorturl/new", (req,res)=>{
  utils.urlValid(req.body.url)
  .then((data)=>{
    return UrlModel.findOne({originalUrl: data})
  })
  .then((data)=>{
    if(!data){ //no existe la url en la db      
      let document = new UrlModel({
        _id: shortid.generate(),
        originalUrl: req.body.url,
      });
      return document.save();
    }
    else //ya existe, se devuelve el resultado del find
      return data;
  })
  .then((data)=>{
    res.json({
      original_url: data.originalUrl, 
      short_url: data._id
    })
  })
  .catch((err)=>{
    console.log(err);
    res.json({error: "invalid URL"})
  })
  
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});