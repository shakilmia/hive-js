"use strict"

var express = require('express')
var path = require('path')
var auth = require('./auth')

var app = express()
app.use(express.bodyParser())
app.use(express.static(path.join(__dirname, '..', 'build')))

app.post('/register', validate_params, function(req, res) {
  var name = req.body.wallet_id
  auth.register(name, req.body.pin, function(err, token){
    if(err) {
      console.error('error', err)
      return res.send(400, err)
    }

    console.log('registered wallet %s', name)
    res.send(200, token)
  })
})

app.post('/login', validate_params, function(req, res) {
  var name = req.body.wallet_id
  auth.login(name, req.body.pin, function(err, token){
    if(err) {
      console.error('error', err)
      return res.send(400, err)
    }

    console.log('authenticated wallet %s', name)
    res.send(200, token)
  })
})

function validate_params(req, res, next) {
  if (!req.body.wallet_id || !req.body.pin) {
    return res.send(400, 'Bad request')
  }
  next()
}

module.exports = app