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

app.get('/questions', async (req, res) => {
  const questions = await Question.findAll();
  res.json(questions);
});

app.get('/questions/:id', async (req, res) => {
  const question = await Question.findByPk(req.params.id);
  if (!question) return res.status(404).send('Question not found');
  res.json(question);
});


/* =========================
   POST
========================= */

app.post('/quiz', async (req, res) => {
  const { titre } = req.body;
  const quiz = await Quiz.create({ titre });
  res.status(201).json(quiz);
});

app.post('/questions', async (req, res) => {
  const { contenu, id_quiz } = req.body;
  // Vérifier que le quiz existe
  const quiz = await Quiz.findByPk(id_quiz);
  if (!quiz) {
    return res.status(404).send('Quiz not found');
  }
  const question = await Question.create({ contenu, id_quiz });
  res.status(201).json(question);
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

app.put('/questions/:id', async (req, res) => {
  const { contenu } = req.body;
  const question = await Question.findByPk(req.params.id);
  if (!question) return res.status(404).send('Question not found');
  question.contenu = contenu;
  await question.save();
  res.json(question);
});


/* =========================
   DELETE
========================= */

app.delete('/quiz/:id', async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);
  if (!quiz) return res.status(404).send('Quiz not found');
  await quiz.destroy();
  res.status(204).send();
});

app.delete('/questions/:id', async (req, res) => {
  const question = await Question.findByPk(req.params.id);
  if (!question) return res.status(404).send('Question not found');
  await question.destroy();
  res.status(204).send();
});


/* =========================
   LANCEMENT SERVEUR
========================= */

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})