const express = require('express')
const app = express()

const PORT = 3000

// Middleware pour lire le JSON
app.use(express.json())

// Import des modèles
const { Quiz, Question, Reponse, Resultat } = require('./migration')

/* =========================
   ROUTE TEST
========================= */

app.get('/hello', (req, res) => {
  res.json({
    message: "Bonjour depuis Node.js + Express 🚀"
  })
})

/* =========================
   GET
========================= */

app.get('/quiz', async (req, res) => {
  const quiz = await Quiz.findAll();
  res.json(quiz);
});

app.get('/quiz/:id', async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);
  if (!quiz) return res.status(404).send('Quiz not found');
  res.json(quiz);
});

/* =========================
   POST
========================= */

app.post('/quiz', async (req, res) => {
  const { titre } = req.body;
  const quiz = await Quiz.create({ titre });
  res.status(201).json(quiz);
});

/* =========================
   PUT
========================= */

app.put('/quiz/:id', async (req, res) => {
  const { titre } = req.body;
  const quiz = await Quiz.findByPk(req.params.id);
  if (!quiz) return res.status(404).send('Quiz not found');
  quiz.titre = titre;
  await quiz.save();
  res.json(quiz);
});

/* =========================
   LANCEMENT SERVEUR
========================= */

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})