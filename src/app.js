const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const pessoa = require('./routes/pessoa')

const app = express()

mongoose.connect('mongodb+srv://medprev:xnjyqvN6AY0arOmm@cluster0.q2pfy.mongodb.net/medprev?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(pessoa)

module.exports = app
