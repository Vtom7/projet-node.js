const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models') // ⚠️ chemin corrigé

const router = express.Router()

const SECRET = 'super_secret_key'

/* REGISTER */
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  const exists = await User.findOne({ where: { email } })
  if (exists) return res.status(400).json({ message: 'Email déjà utilisé' })

  const hash = await bcrypt.hash(password, 10)

  await User.create({ email, password: hash })

  res.json({ message: 'Utilisateur créé' })
})

/* LOGIN */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Mot de passe incorrect' })

  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: '2h' }
  )

  res.json({ token })
})

module.exports = router