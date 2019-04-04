const express = require('express')
const bodyParser = require('body-parser')
const uniqid = require('uniqid')
const app = express()
const cors = require('cors')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ kittens: [] }).write()

app.use(bodyParser.json())
app.use(cors())

const port = 3500

app.get('/kittens', (req, res) => {
  const kittens = db.get('kittens').value()

  return res.send(kittens)
})

app.get('/kittens/:id', (req, res) => {
  const id = req.params.id
  const kitten = db.get('kittens')
  .find({ id: id })
  .value()

  return res.send(kitten)
})

app.delete('/kittens/:id', (req, res) => {
  const id = req.params.id

  db.get('kittens')
  .remove({ id: id })
  .write()

  return res.send('Kitten was removed!')
})

app.post('/kittens', (req, res) => {
  const kitten = req.body
  kitten.id = uniqid()

  db.get('kittens')
  .push(kitten)
  .write()

  return res.send('Kitten added!')
})

app.get('/kittens/:id/adopt', (req, res) => {
  const id = req.params.id
  const kitten = db
    .get('kittens')
    .find({id: id})
    .value()

  if (kitten.adopt) {
    return res
      .status(406)
      .send('Kitten already adopted!')
  }

  db
    .get('kittens')
    .find({ id: id })
    .assign({ adopt: true })
    .write()

  return res.send('Kitten is now adopted!')
})

app.listen(port, () => console.log(`Server is on http://localhost:${port}`))