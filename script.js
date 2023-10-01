// prompt le nom du candidat
var nom = prompt('Entrer votre nom');

const score = [];

function displayScore() {
    var scoreElt = document.getElementById('score');
    scoreElt.textContent = 'Score : ' + score.filter(s => s === true).length;
}

start();
displayScore();

// Il faut la définir en “async” (asynchrone)
// car elle utilise fetch() (et “await” pour attendre une réponse)
async function start() {
    // Récupère le tableau json
    var data = await getJson();

    // Mélange le tableau json
    shuffleArray(data);

    // Coupe le tableau pour ne garder que les 4 premières questions
    data = data.slice(0, 4);

    // Fonction RÉCUPÉRATION DU FICHIER JSON contenant le quiz
    // en “async” car elle utilise fetch() et “await”
    async function getJson() {
        // Récupère les données avec la fonction fetch()
        // Ici le fichier s'appelle quiz.json et il est situé à la racine "/" du dossier projet
        const response = await fetch("http://localhost:5500/quizz.json");
        return response.json(); // Retourne les données au format Json
    }

    // Affiche les questions et les propositions
    var container = document.getElementById('question');

    var index = 0;

    showQuestion(index);

    function removeQuestion(index) {
        const questionElt = document.getElementById('question' + index);
        questionElt.remove();
    }

    // Fonction pour recharger les couleurs à blanc
    function removeColor() {
        document.getElementById("bad").style.display = "none";
        document.getElementById("good").style.display = "none";
    }

    // Boucle sur les questions
    function showQuestion(i) {
        // Crée un élément div
        var divQuest = document.createElement('div');
        divQuest.id = 'question' + i;

        // Affiche la question dans la div avec l'id "question" et dans le h2 avec l'id "question"
        const quest = document.createTextNode(data[i].question);
        const h2 = document.createElement("h2");
        h2.appendChild(quest);
        divQuest.appendChild(h2);
        container.appendChild(divQuest);

        // Boucle sur les propositions
        for (let j = 0; j < data[i].propositions.length; j++) {
            const propositions = document.createTextNode(data[i].propositions[j]);
            const p = document.createElement("p");
            p.appendChild(propositions);
            divQuest.appendChild(p);

            // Créer des input radio
            var input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", "propositions" + i);
            input.setAttribute("id", "propositions" + i + j);
            input.setAttribute("value", data[i].propositions[j]);
            p.appendChild(input);
        }
    }

    document.querySelector("form").addEventListener("submit", validation);
    document.getElementById("next").addEventListener("click", suivant);

    function suivant() {
        removeQuestion(index);
        document.getElementById("btnValidate").disabled = false;
        index++;
        if (index < data.length) {
            showQuestion(index);
            console.log(index);
            removeColor(index);
        } else {
            // Le quiz est terminé, vous pouvez ajouter du code pour gérer la fin du quiz ici
            alert("Quiz terminé! Votre score : " + score.filter(s => s === true).length);
            // Vous pouvez également envoyer le score à une API, etc.
        }
    }

    function validation(event) {
        event.preventDefault();
        var radio = document.querySelector("input[name=propositions" + index + "]:checked");

        if (radio) {
            // Récupère la réponse de la question en cours
            var userAnswer = radio.value;
            var correctAnswer = data[index].reponse;

            if (userAnswer === correctAnswer) {
                // La réponse est correcte
                document.getElementById("good").style.display = "block";
                score.push(true);
            } else {
                // La réponse est incorrecte
                document.getElementById("bad").style.display = "block";
                score.push(false);
            }

            // Désactive le bouton Valider pour éviter de soumettre la même question plusieurs fois
            document.getElementById("btnValidate").disabled = true;
        } else {
            // Aucune réponse sélectionnée
            alert("Veuillez sélectionner une réponse avant de valider.");
        }

        displayScore();
    }
}

// Fonction MÉLANGE ALÉATOIRE du tableau
function shuffleArray(array) {
    return array.sort(() => 0.5 - Math.random());
}

function saveScore(name, score) {
    var newScore = { 'name': name, 'score': score };
    var oldScores = JSON.parse(localStorage.getItem('score')) || [];

    // Ajoute le score du joueur
    oldScores.push(newScore);

    // Trie les scores par ordre décroissant
    oldScores.sort(function (a, b) {
        return b.score - a.score;
    });

    // Conserve les 5 meilleurs scores
    oldScores = oldScores.slice(0, 5);

    // Enregistre tous les scores
    localStorage.setItem('score', JSON.stringify(oldScores));
}

function showScore() {
    var scores = JSON.parse(localStorage.getItem('score'));
    var scoreEl = document.querySelector('#best');

    for (let i = 0; i < scores.length; i++) {
        scoreEl.innerHTML += '<b>' + (i + 1) + '.</b> ' + scores[i]['name'] + ' - Score : ' + scores[i]['score'] + '<br/>';
    }
}

// Affiche les meilleurs scores au chargement de la page
showScore();