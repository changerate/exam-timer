//   CARLOS VARGAS
//   2023-05-23



const worker = new Worker('/timerWorker.js');
// error handling:
worker.onerror = function() {
  document.getElementById("ui-location").innerHTML = '<p style="color: black; font-size: 15px; background-color: #DADADA; border-radius: 5px; padding: 8px;">error communicating with timerWorker.js</p>';
};


/*=================
  RECIEVE
=================*/
worker.onmessage = function(event) {
  // Number-of-questions update
  if (event.data.ques === 'update') {
    const minutes = event.data.remMinQues;
    const seconds = event.data.remSecQues;
    const currentQuestion = event.data.currentQues;
    document.getElementById("questTime").innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById("currentQuestion").innerHTML = `Question ${currentQuestion}`;
  }
  else if (event.data.ques === 'finished') {
    const audio = new Audio("/assets/notifQues.mp3");
    audio.play();
  }
  // Main update
  if (event.data.exam === 'update') {   // Update countdown in the UI
    const minutes = event.data.remMinExam;
    const seconds = event.data.remSecExam;
    document.getElementById("timer").innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  else if (event.data.exam === 'finished') {
    const audio = new Audio("/assets/notifMain.mp3");
    audio.play();
    document.getElementById("ui-location").innerHTML = document.getElementById("end-message-template").innerHTML;
  }
};


/*===================
  REBUILDING THE UI 
=====================*/
// (for when the timer ends and you want to start again)
// note: #ui-location also acts as a div for the end message
function replaceUI() {
  document.getElementById("ui-location").innerHTML = document.getElementById("ui-template").innerHTML;
}


/*===================
  BEGIN
=====================*/
function updateTimer() {
  const timeLimit = parseInt(document.getElementById("timeLimit").value) * 60; // Convert minutes to seconds
  const numQuestions = parseInt(document.getElementById("numQuestions").value);

  replaceUI();
  worker.postMessage({ exam: 'start', ques: 'start', timeLimit, numQuestions });
}