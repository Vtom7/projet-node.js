const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('projet_quiz_musical', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

/* =========================
   MODELES
========================= */

const Quiz = sequelize.define('Quiz', {
  titre: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
});

const Question = sequelize.define('Question', {
  contenu: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_quiz: {
    type: DataTypes.INTEGER, // ⚠️ DOIT matcher Quiz.id
    allowNull: false,
    references: {
      model: Quiz,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
});

const Reponse = sequelize.define('Reponse', {
  reponse: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_question: {
    type: DataTypes.INTEGER, // ⚠️ DOIT matcher Quiz.id
    allowNull: false,
    references: {
      model: Question,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
});


/* =========================
   RELATIONS
========================= */

Quiz.hasMany(Question, {
  foreignKey: 'id_quiz'
});

Question.belongsTo(Quiz, {
  foreignKey: 'id_quiz'
});

Question.hasMany(Reponse, {
  foreignKey: 'id_question'
});

Reponse.belongsTo(Question, {
  foreignKey: 'id_question'
});


/* =========================
   EXPORT
========================= */

module.exports = {
  sequelize,
  Quiz,
  Question,
  Reponse
};

/* =========================
   SYNC DB
========================= */

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });