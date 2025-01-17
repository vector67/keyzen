import {
  FINAL_NUMBER_OF_PARTICLES,
  PARTICLE_MASS,
  PARTICLE_PHASE_CHANGE_NUMBER_OF_SECONDS,
  PARTICLES_PER_SECOND_IN_LINEAR_PHASE,
  SHAPE_SIZE,
  PARTICLE_SYSTEM_START_TIME,
} from './constants.js';
import { Particle } from './particle.js';
import { Vector2 } from './vector2.js';

let currentMinParticles = 0;
const getNumberOfParticles = (timeLeft) => -PARTICLES_PER_SECOND_IN_LINEAR_PHASE * timeLeft
  + PARTICLE_SYSTEM_START_TIME * PARTICLES_PER_SECOND_IN_LINEAR_PHASE
  + Math.random() * 5;

const exponentialNumberParticleDivisor = PARTICLE_PHASE_CHANGE_NUMBER_OF_SECONDS
  / (-Math.log((PARTICLE_SYSTEM_START_TIME - PARTICLE_PHASE_CHANGE_NUMBER_OF_SECONDS)
      * PARTICLES_PER_SECOND_IN_LINEAR_PHASE) + Math.log(FINAL_NUMBER_OF_PARTICLES));
export const computeNumberOfParticles = (timeLeft) => {
  if (timeLeft > PARTICLE_PHASE_CHANGE_NUMBER_OF_SECONDS) {
    const potentialNumberOfParticles = getNumberOfParticles(timeLeft);
    currentMinParticles = Math.max(currentMinParticles, potentialNumberOfParticles);
    return currentMinParticles;
  }
  return Math.exp(
    -(timeLeft / exponentialNumberParticleDivisor - Math.log(FINAL_NUMBER_OF_PARTICLES)),
  );
};

export const getNormalRandomVariable = () => {
  const u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

export const calculateParticleHomeForBigShape = (
  i,
  width,
  height,
  laneX,
  laneY,
) => {
  const position = new Vector2(0, 0);
  position.x = (1272 * Math.cos(i)) / (Math.sin(i) ** 2 + 1)
    + (laneX * SHAPE_SIZE) / 8;

  position.y = (1272 * Math.cos(i) * Math.sin(i)) / (Math.sin(i) ** 2 + 1)
    + (laneY * SHAPE_SIZE) / 4 + 150;

  // position.x = laneX * jitter / 2 * 25 * Math.cos(i) ** 2;
  // position.y = laneY * jitter / 2 * 20 * Math.sin(i) ** 2;
  // spiral
  // position.x = (20 + 170 * i) * Math.cos(i * 4) + (laneX * jitter) / 5;
  // position.y = (100 + 100 * i) * Math.sin(i * 4) + (laneY * jitter) / 5;

  const home = new Vector2(0, 100);
  home.x = (position.x / 3000) * width;
  home.y = (position.y / 1500) * height;
  return home;
};

export const createParticle = (index, angle, width, height) => {
  const velocity = new Vector2((Math.random() * 10), -50 * Math.random());
  const acceleration = new Vector2(0, 0);
  const color = `hsl(200, 100%, ${(Math.abs(angle - Math.PI) / Math.PI) * 100}%)`;
  const mass = Math.max((getNormalRandomVariable() * PARTICLE_MASS + PARTICLE_MASS) / 2, 2);

  const laneX = 2 * (Math.random() - 0.5);
  const laneY = 2 * (Math.random() - 0.5);
  const home = calculateParticleHomeForBigShape(angle, width, height, laneX, laneY);

  return new Particle(
    index,
    angle,
    new Vector2(0, height / 2),
    home,
    velocity,
    acceleration,
    color,
    mass,
    laneX,
    laneY,
  );
};

export const calculateLightness = (
  percentage,
  force,
) => (((percentage) * 100 + 10) / (force + 50)) * 50;
