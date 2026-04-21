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
   GET - TOUS LES QUIZ
========================= */

app.get('/quiz', async (req, res) => {
  try {
    const quiz = await Quiz.findAll()
    res.json(quiz)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Erreur lors de la récupération des quiz"
    })
  }
})

/* =========================
   GET - QUIZ AVEC RELATIONS
========================= */

app.get('/quiz-complet', async (req, res) => {
  try {
    const quiz = await Quiz.findAll({
      include: [
        {
          model: Question,
          include: [Reponse]
        },
        {
          model: Resultat
        }
      ]
    })

    res.json(quiz)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Erreur lors de la récupération des données"
    })
  }
})

/* =========================
   GET - UN QUIZ PAR ID
========================= */

app.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          include: [Reponse]
        },
        {
          model: Resultat
        }
      ]
    })

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz non trouvé"
      })
    }

    res.json(quiz)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Erreur serveur"
    })
  }
})

/* =========================
   LANCEMENT SERVEUR
========================= */

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})