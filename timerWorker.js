//   CARLOS VARGAS
//   2023-05-23


let speed = 1000; // controls speed of countdown in milliseconds

/*====================
EXAM TIMER
====================*/
let countdown;
function startTimer(timeLimit) {
  let currentTime = timeLimit; //this will be updated

  // Update the timer display and decrease the currentTime
  countdown = setInterval(() => {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);

    self.postMessage({ // send values back to script.js
      exam: 'update',
      remMinExam: minutes,
      remSecExam: seconds
    });

    currentTime--;
    if (currentTime < 0) {
      clearInterval(countdown);
      self.postMessage({ exam: 'finished' });
    }
  }, speed);
}


/*====================
INDIVIDUAL QUESITONS TIMER
====================*/
let countdownQuestions;
let currentQuestion;
function startQuestionsTimer(timeLimit, numQuestions) {
  currentQuestion++;
  let currentTime = timeLimit / numQuestions;

  // update the timer display
  countdownQuestions = setInterval(() => {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);

    self.postMessage({ // send values back to script.js
      ques: 'update',
      remMinQues: minutes,
      remSecQues: seconds,
      currentQues: currentQuestion
    });

    currentTime--;
    if (currentTime < 0 && currentQuestion < numQuestions) {
      clearInterval(countdownQuestions);
      startQuestionsTimer(timeLimit, numQuestions);
      self.postMessage({ ques: 'finished' });
    }
    // keeps question timer from overrunning
    else if (currentTime < 0 && currentQuestion >= numQuestions) {
      clearInterval(countdownQuestions);
    }
  }, speed)
}


/*====================
// START TO IT ALL
====================*/
// Listen for messages from the main thread
self.onmessage = function(event) {
  if (event.data.exam === 'start') {
    clearInterval(countdown);
    startTimer(event.data.timeLimit);
  }
  if (event.data.ques === 'start') {
    clearInterval(countdownQuestions);
    currentQuestion = 0; // restarts the current question everytime button is pressed
    startQuestionsTimer(event.data.timeLimit, event.data.numQuestions);
  }
};