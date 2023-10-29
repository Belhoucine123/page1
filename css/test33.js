var questions = [];
var currentQuestion = 0;
var score = 0;
var timeLeft = 10;
var countdown;
var typequiz = "css";
var questionElement = document.getElementById("question");
var optionsElement = document.getElementById("options");
var resultElement = document.getElementById("result");
var timerElement = document.getElementById("timer");

var submitButton = document.getElementById("submit-btn");
var restartButton = document.getElementById("restart-btn");

function loadQuiz() {
  
  // Hide the restart button at the start of the quiz
  restartButton.style.display = "none";

  fetch('test33.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      questions = getRandomQuestions(data.questions, 10); 
      displayQuestion();
    })
    .catch(function(error) {
      console.log('Error loading questions:', error);
    });
}


function getRandomQuestions(questions, count) {
  var shuffledQuestions = questions.slice();
  shuffledQuestions.sort(function() {
    return 0.5 - Math.random();
  });
  
  var selectedQuestions = shuffledQuestions.slice(0, count);
  var uniqueQuestions = Array.from(new Set(selectedQuestions.map(JSON.stringify))).map(JSON.parse);
  
  return uniqueQuestions;
}

function displayQuestion() {
  var question = questions[currentQuestion];
  questionElement.textContent = question.question;

  optionsElement.innerHTML = "";
  for (var i = 0; i < question.options.length; i++) {
    var li = document.createElement("li");
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "options";
    radio.value = i;
    li.appendChild(radio);
    li.appendChild(document.createTextNode(question.options[i]));
    optionsElement.appendChild(li);
  }

  // Reset and start the timer
  timeLeft = 10;
  timerElement.textContent = "Time left: " + timeLeft + " seconds";
  clearInterval(countdown);
  countdown = setInterval(function() {
    timeLeft--;
    timerElement.textContent = "Time left: " + timeLeft + " seconds";
    if (timeLeft <= 0) {
      clearInterval(countdown);
      submitAnswer();
    }
  }, 1000); 
}

function submitAnswer() {
    var selectedOption = document.querySelector('input[name="options"]:checked');
    var selectedAnswer = selectedOption ? parseInt(selectedOption.value) : -1;
    var question = questions[currentQuestion];
  
    if (selectedAnswer === question.answer) {
      score++;
      console.log('valid response');
    } else {
      console.log('invalid response');
    }
  
    currentQuestion++;
  
    if (currentQuestion === questions.length) {
      console.log('finish question')
      displayResult();
    } else {
      displayQuestion();
    }
}

function displayResult() {
  clearInterval(countdown);
  timerElement.style.display = "none";
  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  submitButton.style.display = "none";
  resultElement.textContent = "Your final score is: " + score + "/" + questions.length;
  resultElement.style.display = "block";
  restartButton.style.display = "block";
  const formData =
    "score=" +
    encodeURIComponent(score) +
    "&length=" +
    encodeURIComponent(questions.length) +
    "&type=" +
    encodeURIComponent(typequiz);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../api/score.php");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(formData);
}

function restartQuiz() {
  clearInterval(countdown);
  timerElement.style.display = "block";
  currentQuestion = 0;
  score = 0;
  questionElement.style.display = "block";
  optionsElement.style.display = "block";
  submitButton.style.display = "block";
  resultElement.style.display = "none";

  // Hide the restart button when the quiz is restarted
  restartButton.style.display = "none";
  displayQuestion();
}

submitButton.addEventListener("click", submitAnswer);
restartButton.addEventListener("click", restartQuiz);

loadQuiz();
