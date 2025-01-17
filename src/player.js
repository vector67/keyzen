
export class Player {
  constructor(data) {
    if (data) {
      this.fromObject(data);
    } else {
      this.points = 0;
    }
  }

  fromObject(data) {
    this.points = data.points ?? 0;
  }
  toObject() {
    return {
      points: this.points
    }
  }

  reset() {
    this.points = 0;
  }
}
