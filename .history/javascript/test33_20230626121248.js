var questions = [];
var currentQuestion = 0;
var score = 0;
var timeLeft = 10;
var countdown;
var questionElement = document.getElementById("question");
var optionsElement = document.getElementById("options");
var resultElement = document.getElementById("result");
var submitButton = document.getElementById("submit-btn");
var restartButton = document.getElementById("restart-btn");

function loadQuiz() {
  restartButton.style.display = "none";

  fetch("questions.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      questions = getRandomQuestions(data.questions, 10);
      displayQuestion();
    })
    .catch(function(error) {
      console.log("Error loading questions:", error);
    });
}

function getRandomQuestions(questions, count) {
  var shuffledQuestions = questions.slice();
  shuffledQuestions.sort(function() {
    return 0.5 - Math.random();
  });

  return shuffledQuestions.slice(0, count);
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

  timeLeft = 10;
  clearInterval(countdown);
  countdown = setInterval(function() {
    timeLeft--;
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
  }

  currentQuestion++;

  if (currentQuestion === questions.length) {
    displayResult();
  } else {
    displayQuestion();
  }
}

function displayResult() {
  clearInterval(countdown);
  questionElement.style.display = "none";
  optionsElement.style.display = "none";
  submitButton.style.display = "none";
  resultElement.textContent = "Your final score is: " + score + "/" + questions.length;
  resultElement.style.display = "block";
  restartButton.style.display = "block";
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  questionElement.style.display = "block";
  optionsElement.style.display = "block";
  submitButton.style.display = "block";
  resultElement.style.display = "none";
  restartButton.style.display = "none";
  displayQuestion();
}

submitButton.addEventListener("click", submitAnswer);
restartButton.addEventListener("click", restartQuiz);
