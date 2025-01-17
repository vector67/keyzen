import { ParticleSystemRenderer } from './particle-simulator.js';

const particleSystemRenderer = new ParticleSystemRenderer();

const setPercentageComplete = (timeLeft) => {
  particleSystemRenderer.setPercentageComplete(timeLeft);
}

const setTimeLeft = (timeLeft) => {
  particleSystemRenderer.setTimeLeft(timeLeft);
}

let time = Date.now();
let previousFrame = 0;

const fpsGoal = 30;
const simulationSpeed = 1;
const initializeParticleSystem = () => {
  const canvas = document.getElementById("canvas");

  particleSystemRenderer.initialize(canvas);
  particleSystemRenderer.setTimeLeft(1000);

  const [width, height] = [window.innerWidth, window.innerHeight];
  canvas.width = width;
  canvas.height = height * 0.75;
  const context = canvas.getContext('2d');

  let animationFrameId;
  let previousFrameTime = Date.now();
  let frameNumber = 0;
  const render = async () => {
    particleSystemRenderer.doFrame();
    particleSystemRenderer.renderFrame(context, canvas);

    if (Date.now() - time > 1000) {
      time = Date.now();
      console.log('rendered', frameNumber)
      frameNumber = 0;
    }
    if (Date.now() - previousFrameTime < 1000/fpsGoal) {
      await new Promise(r => setTimeout(r, 1000/fpsGoal - (Date.now() - previousFrameTime)));
    }
    previousFrameTime = Date.now();
    frameNumber++;

    animationFrameId = window.requestAnimationFrame(render);
  };
  render();
}

export const particles = {
  initializeParticleSystem,
  setTimeLeft,
  setPercentageComplete
};
