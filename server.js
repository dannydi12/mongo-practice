const express = require('express');
const mongoose = require('mongoose');
const bodyParser = express.json();
const { Sport, Person } = require('./model');

const app = express();

app.get('/api/getSports', (req, res) => {

  Sport.getAllSports()
    .then(listOfSports => {
      return res.status(200).json(listOfSports)
    })
    .catch(err => {
      return res.status(400).end()
    })
})

app.post('/api/createSport', bodyParser, (req, res) => {
  const { id, name, num_players } = req.body;

  const newSport = {
    id, name, num_players
  }

  Sport
    .addSport(newSport)
    .then(createdSport => {
      return res.status(201).json(createdSport)
    })
    .catch(err => {
      return res.status(400).end()
    })
})

app.post('/api/createPerson', bodyParser, (req, res) => {
  const { firstName, lastName, sportId } = req.body;


  Sport
    .getById(Number(sportId))
    .then(response => {
      const newPerson = {
        firstName,
        lastName,
        sport: response._id
      }
      Person
        .addPerson(newPerson)
        .then(createdPerson => {
          return res.status(201).json(createdPerson)
        })
        .catch(err => {
          return res.status(400).end()
        })
    })
})

app.listen(8080, () => {

  return new Promise((resolve, reject) => {
    mongoose.connect('mongodb://localhost/sportsdb', { useNewUrlParser: true, useUnifiedTopology: true }, errResponse => {
      if (errResponse) {
        return reject(errResponse)
      }
      else {
        resolve()
      }
    })
  })
    .then(response => {
      console.log('App running')
    })
    .catch(errResponse => {
      mongoose.disconnect()
      console.log(errResponse)
    })
})