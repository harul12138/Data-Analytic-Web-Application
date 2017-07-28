/**
 * The file to start a server

 *
 */
var express = require('express')
var path = require('path')
var revision = require('./app/models/revision.js')
var fs = require('fs')
var async = require('async');
var MediaWiki = require("mediawiki")
var port = process.env.PORT || 3000
var app = express()

app.set('views', path.join(__dirname,'app','views'));
//app.set('views', './app/views/pages')
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.use(require('body-parser').urlencoded({extended:true}))
app.listen(port)


var request = require('request')
var revroutes = require('./app/routes/revision.router')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/wikipedia', function (err) {
    if(!err)
        console.log('mongodb connected')
})


//overall
app.use('/', revroutes)
//individual
app.use('/individual/:title',revroutes)
//single user
app.use('/individual/userDistribution/:title&:user&:random',revroutes)


console.log('Revisions started on port' + port)