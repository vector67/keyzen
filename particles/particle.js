import { Vector2 } from './vector2.js';
import { BASE_HUE, FRICTION_CONSTANT, LIGHT_STRIPE_HERTZ, ANGLE_CHANGE_CONSTANT } from './constants.js';
import { calculateLightness, calculateParticleHomeForBigShape } from './utils.js';


export class Particle {
  constructor(
    index,
    angle,
    position,
    home,
    velocity,
    acceleration,
    color,
    mass,
    laneX,
    laneY,
  ) {
    this.index = index;
    this.angle = angle;
    this.position = position;
    this.home = home;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.color = color;
    this.size = 1.5 * Math.sqrt(mass);
    this.mass = mass;
    this.laneX = laneX;
    this.laneY = laneY;
  }

  index;

  angle;

  position= new Vector2(0, 0);

  home= new Vector2(0, 0);

  velocity= new Vector2(0, 0);

  acceleration= new Vector2(0, 0);

  forces= {};

  color= '';

  size= 0;

  mass= 0;

  laneX;

  laneY;

  totalForce= 0;
  gradient;

  recalculateColor(frame) {
    // This function is basically magic figured out through a lot of trial and error
    // It's a lot of fun to tweak it and see what happens, but there's no good way
    // of making a specific and measured change. You have to just play with it and
    // see what happens. If you want to see the graphs of what this function ends
    // up looking like, uncomment the line in the particle draw function which
    // draws the graphs
    const angle = this.angle / 2 / Math.PI;
    const colorPercentage = (Math.abs(((angle * 80 + (frame * 2 * LIGHT_STRIPE_HERTZ)) % 80) - 40) + 5) / 50;
    this.color = `hsla(${Math.floor((40 * ((30 + ((colorPercentage * 100) % 100)) / 100) + 180 - (this.totalForce * 15)) + BASE_HUE)}, 100%, ${Math.floor(calculateLightness(colorPercentage, this.totalForce))}%, 1)`;
  }

  update(mousePos, frame, canvas, attractorParticle) {
    this.angle += ((this.laneX + this.laneY) ** 2) * ANGLE_CHANGE_CONSTANT;

    this.home = calculateParticleHomeForBigShape(
      this.angle,
      canvas.offsetWidth,
      canvas.offsetHeight,
      this.laneX,
      this.laneY,
    );

    this.calculateReturnForce();
    this.calculateMouseRepulsionForce(mousePos);
    if (attractorParticle && attractorParticle !== this && attractorParticle.index !== -2) {
      this.doAttractorForce(attractorParticle.position);
    } else if (!attractorParticle || attractorParticle.index !== -2) {
      this.replaceForce(new Vector2(0, 0), 'attractorForce');
    } else if (attractorParticle && attractorParticle.index === -2) {
      const force = this.getForce('attractorForce');
      if (force) force.setMagnitude(force.getMagnitude() * 0.994);
    }
    this.calculateFrictionForce();

    this.recalculateColor(frame);

    this.acceleration.reset();
    this.addForcesToAcceleration();

    this.velocity.addVector(this.acceleration);
    this.position.addVector(this.velocity);
  }

  addForcesToAcceleration() {
    this.totalForce = 0;

    const forceKeys = Object.keys(this.forces);
    for (let i = 0; i < forceKeys.length; i += 1) {
      const forceType = forceKeys[i];
      if (Number.isNaN(this.forces[forceType].x)) {
        this.forces[forceType].reset();
      } else {
        this.acceleration.addVector(this.forces[forceType].getScalarProduct(1 / this.size));
        this.acceleration.capTo(1000);
        if (forceType !== 'returnForce') this.totalForce += this.forces[forceType].getMagnitude() / 2;
      }
    }
  }

  replaceForce(force, type) {
    this.forces[type] = force;
  }

  getForce(type) {
    return this.forces[type];
  }

  squareDistance(vector) {
    return (((vector.x - this.position.x) ** 2 + (vector.y - this.position.y) ** 2));
  }

  distance(vector) {
    return (Math.sqrt(this.squareDistance(vector)));
  }

  directionTo(point) {
    return (Math.atan2((point.y - this.position.y), (point.x - this.position.x)));
  }

  calculateFrictionForce() {
    const frictionForce = new Vector2(0, 0);
    const direction = this.directionTo(
      new Vector2(this.position.x + this.velocity.x, this.position.y + this.velocity.y),
    ) + Math.PI;
    const magnitude = FRICTION_CONSTANT * (this.velocity.getMagnitude() ** 1);
    frictionForce.setMagnitudeAndDirection(
      magnitude,
      direction,
    );

    this.replaceForce(frictionForce, 'friction');
  }

  calculateMouseRepulsionForce(mousePos) {
    const mouseRepulsionForce = new Vector2(0, 0);

    const mouseDistanceSquare = this.squareDistance(mousePos);
    if (mouseDistanceSquare < 16000) {
      const direction = this.directionTo(mousePos) - Math.PI / 1.3;
      mouseRepulsionForce.setMagnitudeAndDirection(
        100000 / mouseDistanceSquare,
        direction,
      );
    } else {
      mouseRepulsionForce.setMagnitudeAndDirection(0, 0);
    }
    this.replaceForce(mouseRepulsionForce, 'mouseRepulsion');
  }

  calculateReturnForce() {
    const direction = this.directionTo(this.home);
    const distance = this.distance(this.home);
    let magnitude = 0;
    if (distance > 5) {
      magnitude = distance / 100;
    }
    const returnForce = new Vector2(0, 0);
    returnForce.setMagnitudeAndDirection(magnitude, direction);

    this.replaceForce(returnForce, 'returnForce');
  }

  doAttractorForce(attractorPosition) {
    const particleDistanceSquare = this.squareDistance(attractorPosition) ** 0.3;
    const attractorAttractionDirection = this.directionTo(attractorPosition) + 0.3;

    const attractorAttractionForce = new Vector2(0, 0);
    attractorAttractionForce.setMagnitudeAndDirection(Math.min(800 / particleDistanceSquare, 100) * 0.4, attractorAttractionDirection);
    this.replaceForce(attractorAttractionForce, 'attractorForce');
  }

  draw(ctx, canvas, frame) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(
      // 0, 0, 5, 0, 3
      canvas.width / 2 + this.position.x,
      canvas.height / 2 + this.position.y,
      this.size + Math.abs((frame % 30) / 30 - 0.5),
      0,
      2 * Math.PI,
    );
    ctx.fill();

    // Uncomment this in order to see what the color function looks like
    // x axis is the totalForce, and y is the angle from 0 to 2PI
    // if (this.index === 0) {
    //   this.drawColorGraphs(frame, ctx);
    // }
  }

  // eslint-disable-next-line class-methods-use-this
  drawColorGraphs(frame, ctx) {
    const rectSize = 4;
    for (let x = 0; x < 100; x += 1) {
      for (let y = 0; y < 100; y += 1) {
        const totalForce = x;
        const angle = (y / 100) * 2 * Math.PI;

        const colorPercentage = (Math.abs(((angle * 80 + (frame / 2)) % 80) - 40) + 5) / 50;
        const hue = (40 * (
          (BASE_HUE + ((colorPercentage * 100) % 100)) / 100
        ) + 180 - (totalForce * 15)) + 150;
        const lightness = calculateLightness(colorPercentage, totalForce);

        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, 1)`;
        ctx.fillRect(x * rectSize, y * rectSize, rectSize, rectSize);
      }
    }
  }
}
