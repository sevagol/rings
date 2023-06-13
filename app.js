let model, webcam, labelContainer, maxPredictions;
let isFrontCamera = true;

async function init() {
  const URL = 'https://teachablemachine.withgoogle.com/models/7B7BFIxNp/'; // Замените на URL вашей модели Teachable Machine

  model = await tmImage.load(URL + 'model.json');
  maxPredictions = model.getTotalClasses();

  await setupCamera();
  document.getElementById('videoElement').srcObject = webcam.stream;

  labelContainer = document.getElementById('prediction');
}

async function setupCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');

    let deviceId;
    if (isFrontCamera) {
      deviceId = videoDevices.find(device => device.label.toLowerCase().includes('front'))?.deviceId;
    } else {
      deviceId = videoDevices.find(device => device.label.toLowerCase().includes('back'))?.deviceId;
    }

    const constraints = {
      video: { deviceId: { exact: deviceId } }
    };

    webcam = await tmImage.createWebcam(400, 300, constraints);
    await webcam.setup();
    await webcam.play();
  }
}

async function switchCamera() {
  isFrontCamera = !isFrontCamera;
  await webcam.stop();
  await setupCamera();
  document.getElementById('videoElement').srcObject = webcam.stream;
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  labelContainer.innerHTML = '';
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    const predictionElement = document.createElement('div');
    predictionElement.innerText = classPrediction;
    labelContainer.appendChild(predictionElement);
  }
}

init();
