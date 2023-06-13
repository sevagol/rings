navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    var video = document.getElementById('videoElement');
    video.srcObject = stream;
  })
  .catch(function (err) {
    console.log("An error occurred: " + err);
  });

var model, webcam, labelContainer, maxPredictions;

async function init() {
  const URL = 'https://teachablemachine.withgoogle.com/models/7B7BFIxNp/'; // Замените на URL вашей модели Teachable Machine

  model = await tmImage.load(URL + 'model.json');
  maxPredictions = model.getTotalClasses();

  const flip = true; // Флип изображения (true для большинства камер, false для некоторых)
  webcam = new tmImage.Webcam(400, 300, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById('videoElement').appendChild(webcam.canvas);
  labelContainer = document.getElementById('prediction');
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement('div'));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}

init();
