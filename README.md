Pour lancer le serveur (voir exectuer un fichier JavaScript), faire la commande node nom-projet.js

Afficher le message dans app.js, faire la commande
`curl -X GET http://localhost:3000/hello`



# Table quiz

```
curl -X GET "http://localhost:3000/quiz"
curl -X GET "http://localhost:3000/quiz/2"
curl -X POST "http://localhost:3000/quiz" -H "Content-Type: application/json" -d '{"titre": "Quiz 3"}'
curl -X PUT "http://localhost:3000/quiz/3" -H "Content-Type: application/json" -d '{"titre": "Quiz n°3"}'
curl -X DELETE "http://localhost:3000/quiz/3"
```

# Table questions

```
curl -X GET "http://localhost:3000/questions"
curl -X GET "http://localhost:3000/questions/1"
curl -X POST "http://localhost:3000/questions" -H "Content-Type: application/json" -d '{"contenu": "Qui est-elle ?", "id_quiz":2}'
curl -X PUT "http://localhost:3000/questions/4" -H "Content-Type: application/json" -d '{"contenu": "Qui sont-elle ?"}'
curl -X DELETE "http://localhost:3000/questions/4"
```

# Table reponses

```
curl -X GET "http://localhost:3000/reponses"
curl -X GET "http://localhost:3000/reponses/1"
curl -X POST "http://localhost:3000/reponses" -H "Content-Type: application/json" -d '{"reponse": "Bob", "id_question":3}'
curl -X PUT "http://localhost:3000/reponses/5" -H "Content-Type: application/json" -d '{"reponse": "Marley"}'
curl -X DELETE "http://localhost:3000/reponses/5"
```