const { createDevice } = RNBO;
let delaySlider = document.getElementById('delayTime');
let feedbackSlider = document.getElementById('feedback');
let context;
let delay;
let el;
let videoEl = document.getElementById('chime-vid');
videoEl.preservesPitch = false;
let videoDiv = document.getElementById('videoDiv');
let buttonEl = document.getElementById('buttonText');
let windText = [''];
let vFiles = ['video/chime.mov_1.mp4','video/chime.mov_2.mp4','video/chime.mov_3.mp4','video/chime.mov_4.mp4','video/chime.mov_5.mp4','video/chime.mov_6.mp4','video/chime.mov_7.mp4','video/chime.mov_8.mp4','video/chime.mov_9.mp4','video/chime.mov_10.mp4','video/chime.mov_11.mp4','video/chime.mov_12.mp4','video/chime2.mov_1.mp4','video/chime2.mov_2.mp4','video/chime2.mov_3.mp4','video/chime2.mov_4.mp4','video/chime2.mov_5.mp4','video/chime2.mov_6.mp4','video/chime2.mov_7.mp4','video/chime2.mov_8.mp4','video/chime2.mov_9.mp4','video/chime2.mov_10.mp4','video/chime2.mov_11.mp4'];



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const min = 0;
const max = window.innerWidth - 420;

// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function chime() {
    videoDiv.style.left = clamp((Math.random() * window.innerWidth), min, max) +'px';
    videoDiv.style.top = (Math.random() * window.innerHeight - 90) +'px';
    buttonEl.innerHTML = windText[getRandomInt(windText.length)];
    videoEl.src =  vFiles[getRandomInt(vFiles.length)];
    videoEl.playbackRate = Math.random();
    videoEl.play();
}

function gust(){
    chime();
    videoEl.muted = false;
    context.resume();
}

function stop(){
    videoEl = document.getElementById('chime-vid');
    videoEl.pause();
    videoEl.src=null;
}

async function setup() {
    //const WAContext = window.AudioContext || window.webkitAudioContext;
    //context = new WAContext();
    context = getAudioContext();
    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);

    // Fetch the exported patchers
    //let response = await fetch("rnbo.filterdelay.json");
    //const delayPatcher = await response.json();
    let response = await fetch("rnbo.platereverb.json");
    const reverbPatcher = await response.json();

    // Create the devices
    //const delayDevice = await createDevice({ context, patcher: delayPatcher });
    const reverbDevice = await createDevice({ context, patcher: reverbPatcher });
    videoEl = document.getElementById('chime-vid');
    const source = context.createMediaElementSource(videoEl);
    // Connect the devices in series
    //source.connect(delayDevice.node);
    //delayDevice.node.connect(reverbDevice.node);
    reverbDevice.node.connect(outputNode);
    delay = new p5.Delay(0.01, 0.8);
    delay.disconnect();
    delay.setInput(source);
    delay.wet(0.75);
    delay.connect(reverbDevice.node);
    //source.connect(delay);
}

function updateDelayTime(value) {
    delay.delayTime(value);
}

function updateFeedback(value) {
    delay.feedback(value);
}

function updateSpeed(value) {
    videoEl.playbackRate = value;
}

function updateTimeStretch(value) {
    videoEl.preservesPitch = value;
}

function keyPressed() {
    if (key === 'd') {
        
    }
    if (key === 'f') {
    // Code to run.
    }
    if (key === 's') {
        stop();
    }
    if (key === ' ') {
        gust();
    }
}