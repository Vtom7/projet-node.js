const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8100;

// ⚠️ à mettre dans un .env en production
const SECRET = "super_secret_key_change_me";

// Middleware
app.use(cors());
app.use(express.json());

/* =========================
   MODELS
========================= */
const { Quiz, Question, Reponse, User } = require('./migration');


/* =========================
   AUTH MIDDLEWARE
========================= */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


/* =========================
   TEST ROUTE
========================= */
app.get('/hello', (req, res) => {
  res.json({ message: "API OK 🚀" });
});


/* =========================
   AUTH ROUTES
========================= */

// REGISTER
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login success",
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* =========================
   QUIZ (PROTÉGÉ)
========================= */

// GET ALL QUIZ
app.get('/quiz', authenticateToken, async (req, res) => {
  const quiz = await Quiz.findAll();
  res.json(quiz);
});

// GET BY ID
app.get('/quiz/:id', authenticateToken, async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.json(quiz);
});

// CREATE
app.post('/quiz', authenticateToken, async (req, res) => {
  const { titre } = req.body;

  const quiz = await Quiz.create({ titre });

  res.status(201).json(quiz);
});

// UPDATE
app.put('/quiz/:id', authenticateToken, async (req, res) => {
  const { titre } = req.body;

  const quiz = await Quiz.findByPk(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  quiz.titre = titre;
  await quiz.save();

  res.json(quiz);
});

// DELETE
app.delete('/quiz/:id', authenticateToken, async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  await quiz.destroy();

  res.status(204).send();
});


/* =========================
   QUESTIONS (PROTÉGÉ)
========================= */

app.get('/questions', authenticateToken, async (req, res) => {
  const questions = await Question.findAll();
  res.json(questions);
});

app.post('/questions', authenticateToken, async (req, res) => {
  const { contenu, id_quiz } = req.body;

  const quiz = await Quiz.findByPk(id_quiz);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  const question = await Question.create({ contenu, id_quiz });

  res.status(201).json(question);
});

app.put('/questions/:id', authenticateToken, async (req, res) => {
  const { contenu } = req.body;

  const question = await Question.findByPk(req.params.id);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  question.contenu = contenu;
  await question.save();

  res.json(question);
});

app.delete('/questions/:id', authenticateToken, async (req, res) => {
  const question = await Question.findByPk(req.params.id);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  await question.destroy();

  res.status(204).send();
});


/* =========================
   REPONSES (PROTÉGÉ)
========================= */

app.get('/reponses', authenticateToken, async (req, res) => {
  const reponses = await Reponse.findAll();
  res.json(reponses);
});

app.post('/reponses', authenticateToken, async (req, res) => {
  const { reponse, id_question } = req.body;

  const question = await Question.findByPk(id_question);
  if (!question) return res.status(404).json({ message: "Question not found" });

  const newReponse = await Reponse.create({ reponse, id_question });

  res.status(201).json(newReponse);
});

app.put('/reponses/:id', authenticateToken, async (req, res) => {
  const { reponse } = req.body;

  const reponseDB = await Reponse.findByPk(req.params.id);

  if (!reponseDB) {
    return res.status(404).json({ message: "Reponse not found" });
  }

  reponseDB.reponse = reponse;
  await reponseDB.save();

  res.json(reponseDB);
});

app.delete('/reponses/:id', authenticateToken, async (req, res) => {
  const reponse = await Reponse.findByPk(req.params.id);

  if (!reponse) {
    return res.status(404).json({ message: "Reponse not found" });
  }

  await reponse.destroy();

  res.status(204).send();
});


/* =========================
   SERVER START
========================= */

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});