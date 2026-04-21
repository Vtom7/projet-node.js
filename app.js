const express = require('express')
const app = express()

const PORT = 3000

app.get('/hello', (req, res) => {
  res.json({
    message: "Bonjour depuis Node.js + Express 🚀"
  })
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})