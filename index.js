const webcamDisplay = document.getElementById('webcam');

webcamDisplay.classList.add('col', 's12');

    // webcamDisplay.clientWidth = '100%';

    // webcamDisplay.clientHeight = '50%';
const classifier = knnClassifier.create();
let net;

const app = async () => {
    document.getElementById("postload").hidden = true;

    net = await mobilenet.load();

    document.getElementById("preload").hidden = true;
    document.getElementById("postload").hidden = false;

    console.log('calling setupWebcam')
    await setupWebcam();
    console.log("Webcam call successful")

    // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamDisplay, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
  };

  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('click', () => addExample(0));
  document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-c').addEventListener('click', () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamDisplay, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation,3);

      const classes = ['A', 'B', 'C'];
      document.getElementById('console').innerText = `Prediction: ${classes[result.classIndex]}\nProbability: ${result.confidences[result.classIndex]}
      `;
      await tf.nextFrame();
    }

    await tf.nextFrame();
  }
};

const setupWebcam = async () => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia         ||
                             navigatorAny.webkitGetUserMedia||
                             navigatorAny.mozGetUserMedia   ||
                             navigatorAny.msGetUserMedia;

    if(navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, (videoStream) => {
            webcamDisplay.srcObject = videoStream;
            webcamDisplay.addEventListener('loadeddata', (success) => console.log('video loaded'))
        }, (error) => {
            alert('Error occured please check the logs in console');
            console.error(error);
        })
    } else {
        ((error) => {
            alert('Error occured please check the logs in console');
            console.error(error);
        })();
    }
};

app();