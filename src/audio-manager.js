const ding = new Audio("ding.wav");

export class AudioManager {
  constructor(eventManager) {
    this.eventManager = eventManager;

    this.eventManager.subscribe('playerGainedUnit', () => {
      ding.play();
    });
  }
}
