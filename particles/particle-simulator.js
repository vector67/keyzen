import {
  FINAL_NUMBER_OF_PARTICLES,
} from './constants.js';
import { Particle } from './particle.js';
import { Vector2 } from './vector2.js';
import { computeNumberOfParticles, createParticle } from './utils.js';

export class ParticleSystemRenderer {
  particles = [];

  numberOfParticles = 0;

  targetNumberOfParticles = 0;

  frame = 0;

  mousePos = new Vector2(-10000, 100000);

  canvas;

  attractorParticle = null;

  attractorParticleEndFrame = 0;

  attractorParticlePreviousIndex;

  async doFrame() {
    // This chooses a random particle every ten thousand frames to become the attractor.
    // After about 180 frames it is reset.
    if (Math.random() < 0.0001 && this.numberOfParticles > 0) {
      this.attractorParticle = this.particles[Math.round(Math.random() * this.numberOfParticles)];
      this.attractorParticleEndFrame = Math.round(this.frame + Math.random() * 300 + 30);
    }
    if (this.attractorParticle && this.frame > this.attractorParticleEndFrame) {
      this.attractorParticlePreviousIndex = this.attractorParticlePreviousIndex || this.attractorParticle.index;
      this.attractorParticle.index = -2;
    }
    if (this.attractorParticle && this.frame > this.attractorParticleEndFrame + 200) {
      this.attractorParticle.index = this.attractorParticlePreviousIndex;
      this.attractorParticle = null;
      this.attractorParticlePreviousIndex = undefined;
    }
    this.particles.forEach((particle) => {
      particle.update(this.mousePos, this.frame, this.canvas, this.attractorParticle);
    });
  }

  renderFrame(ctx, canvas) {
    this.canvas = canvas;
    this.frame += 1;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((particle) => {
      particle.draw(ctx, this.canvas, this.frame);
    });
  }

  initialize(canvas) {
    this.canvas = canvas;

    document.addEventListener('mousemove', (event) => {
      this.mousePos.x = (event.clientX - canvas.getBoundingClientRect().left - canvas.width / 2);
      this.mousePos.y = (event.clientY - canvas.getBoundingClientRect().top - canvas.height / 2);
    });
  }

  setTimeLeft(timeLeft) {
    const newTargetNumberOfParticles = computeNumberOfParticles(timeLeft);
    this.setNumberOfParticles(newTargetNumberOfParticles);
  }

  setPercentageComplete(percentage) {
    const newTargetNumberOfParticles = percentage * FINAL_NUMBER_OF_PARTICLES;
    this.setNumberOfParticles(newTargetNumberOfParticles);
  }

  setNumberOfParticles(newTargetNumberOfParticles) {
    if (this.targetNumberOfParticles < newTargetNumberOfParticles) {
      this.addMoreParticles(newTargetNumberOfParticles - this.targetNumberOfParticles);
      this.targetNumberOfParticles = newTargetNumberOfParticles;
    } else if (this.numberOfParticles > newTargetNumberOfParticles){
      this.particles.splice(0, this.targetNumberOfParticles - newTargetNumberOfParticles);
      this.numberOfParticles = newTargetNumberOfParticles
      this.targetNumberOfParticles = newTargetNumberOfParticles
    }
  }

  addFlair(strength) {
    
  }

  addMoreParticles(numberOfParticlesToAdd) {
    let interval = 1000 / numberOfParticlesToAdd;
    let particlesPerTime = 1;
    // 30 is just about the smallest interval that will consistently run. If it drops
    // lower, rather create more particles at once and do it less often
    while (interval < 30) {
      interval *= 2;
      particlesPerTime *= 2;
    }

    const intervalId = setInterval(() => {
      if (this.numberOfParticles >= this.targetNumberOfParticles) {
        clearInterval(intervalId);
      }
      this.createNewParticles(particlesPerTime);
    }, interval);
  }

  createNewParticles(particlesPerTime) {
    Array.from({ length: particlesPerTime}).forEach((_) => {
      const angle = Math.random() * Math.PI * 2;
      const newParticle = createParticle(
        this.numberOfParticles,
        angle,
        this.canvas.offsetWidth || 0,
        this.canvas.offsetHeight || 0,
      );
      this.particles.push(newParticle);
      this.numberOfParticles += 1;
    });
  }

  destroy() {
    this.particles = [];
    this.numberOfParticles = 0;
    this.targetNumberOfParticles = 0;
  }
}
