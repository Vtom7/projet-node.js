const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('projet_quiz_musical', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const Quiz = sequelize.define('Quiz', {
    titre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_question: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    id_resultat: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
});

const Question = sequelize.define('Question', {
    ordre_question: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    texte_question: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    id_quiz: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
});

const Reponse = sequelize.define('Reponse', {
    texte_reponse: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correcte: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    id_question: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
});

const Resultat = sequelize.define('Resultat', {
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pourcentage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rang: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    date_resultat: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_quiz: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
});

/* =========================
   RELATIONS
========================= */

// QUIZ -> QUESTION
Quiz.hasMany(Question, {
    foreignKey: 'id_quiz'
})

Question.belongsTo(Quiz, {
    foreignKey: 'id_quiz'
})

// QUESTION -> REPONSE
Question.hasMany(Reponse, {
    foreignKey: 'id_question'
})

Reponse.belongsTo(Question, {
    foreignKey: 'id_question'
})

// QUIZ -> RESULTAT
Quiz.hasMany(Resultat, {
    foreignKey: 'id_quiz'
})

Resultat.belongsTo(Quiz, {
    foreignKey: 'id_quiz'
})

/* =========================
   EXPORT
========================= */

module.exports = {
    sequelize,
    Quiz,
    Question,
    Reponse,
    Resultat
}

sequelize.sync()
  .then(() => {
	console.log('Database & tables created!');
	  })
	    .catch(err => {
	console.error('Unable to connect to the database:', err);
	  });