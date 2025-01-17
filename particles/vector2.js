export class Vector2 {
  x= 0;

  y= 0;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }

  divide(arg) {
    this.x /= arg;
    this.y /= arg;
  }

  scalarProduct(arg) {
    this.x *= arg;
    this.y *= arg;
  }

  getScalarProduct(arg) {
    return new Vector2(this.x * arg, this.y * arg);
  }

  addVector(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  setMagnitudeAndDirection(magnitude, direction) {
    this.x = Math.cos(direction) * magnitude;
    this.y = Math.sin(direction) * magnitude;
  }

  setMagnitude(magnitude) {
    const d = this.getDirection();
    this.x = Math.cos(d) * magnitude;
    this.y = Math.sin(d) * magnitude;
  }

  setDirection(direction) {
    const mag = this.getMagnitude();
    this.x = Math.cos(direction) * mag;
    this.y = Math.sin(direction) * mag;
  }

  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  getDirection() {
    return Math.atan2(this.y, this.x);
  }

  capTo(value) {
    this.x = Math.min(value, this.x);
    this.x = Math.max(-value, this.x);
    this.y = Math.min(value, this.y);
    this.y = Math.max(-value, this.y);
  }
}
