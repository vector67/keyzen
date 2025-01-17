const MAX_HEALTH = 500;
const getDefaultPlayerMetrics = () => ({ units: 0, health: MAX_HEALTH, shield: 0 });

export class Player {
  constructor(eventManager, data) {
    this.metrics = getDefaultPlayerMetrics();
    if (data) {
      this.fromObject(data);
    }

    this.eventManager = eventManager;

    this.eventManager.subscribe('levelChanged', (({level}) => {
      console.log('got level', level);
      this.level = level;
    }).bind(this));

    this.eventManager.subscribe('keystrokeCorrect', (({key}) => {
      this.metrics.health += 1;
      if (this.metrics.health > MAX_HEALTH) {
        this.metrics.shield +=  this.metrics.health - MAX_HEALTH;
        this.metrics.health = MAX_HEALTH;
      }

      if (this.metrics.shield > this.level * 4) {
        this.eventManager.dispatch('playerGainedUnit');
        this.metrics.shield -= this.level;
        this.metrics.units += 1;
      }
    }).bind(this));

    this.eventManager.subscribe('keystrokeWrong', (({key}) => {
      this.metrics.shield -= this.level;
      if (this.metrics.shield < 0) {
        this.metrics.health += this.metrics.shield;
        this.metrics.shield = 0;
      }

      if (this.metrics.health <= 0) {
        this.eventManager.dispatch('playerLost');
        this.reset();
      }
    }).bind(this));
  }

  fromObject(data) {
    Object.assign(this.metrics, data);
  }

  toObject() {
    return this.metrics;
  }

  reset() {
    this.metrics = getDefaultPlayerMetrics();
  }
}
