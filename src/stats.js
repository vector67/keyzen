class TimedKeystroke {
  constructor(time, key, correct) {
    this.time = time;
    this.key = key;
    this.correct = correct;
  }
}
export class Stats {
  start_time;
  hpm;
  ratio;
  keys_per_mistake;
  constructor(store, eventManager) {
    this.store = store;
    this.eventManager = eventManager;
    this.eventManager.subscribe(
      "playerLost",
      (() => {
        this.updateStats(0, 0);
      }).bind(this),
    );

    this.keystrokes = [];

    this.eventManager.subscribe(
      "keystrokeCorrect",
      (({ key }) => {
        this.keystrokes.push(new TimedKeystroke(new Date(), key, true));
      }).bind(this),
    );

    this.eventManager.subscribe(
      "keystrokeWrong",
      (({ key }) => {
        this.keystrokes.push(new TimedKeystroke(new Date(), key, false));
      }).bind(this),
    );
  }

  start_stats() {
    this.start_time =
      this.start_time || Math.floor(new Date().getTime() / 1000);
  }

  updateStats(hits_wrong, hits_correct) {
    if (this.start_time) {
      var current_time = Math.floor(new Date().getTime() / 1000);
      hits_correct = this.keystrokes.filter(
        (keystroke) => keystroke.correct,
      ).length;
      hits_wrong = this.keystrokes.length - hits_correct;
      this.ratio = Math.floor(
        (hits_correct / (hits_correct + hits_wrong)) * 100,
      );
      this.keys_per_mistake = hits_correct / hits_wrong;

      this.hpm = Math.floor(
        ((hits_correct + hits_wrong) / (current_time - this.start_time)) * 60,
      );
      if (!isFinite(this.hpm)) {
        this.hpm = 0;
      }
    }
  }
  render_stats_and_level_bar(hits_wrong, hits_correct) {
    $("#stats").text(
      [
        "raw WPM: ",
        this.hpm / 5,
        " ",
        "accuracy: ",
        this.ratio,
        "% ",
        "letters per mistake: ",
        Math.floor(this.keys_per_mistake),
      ].join(""),
    );
    // console.log('level', this.store.level, 'hits_wrong', hits_wrong, 'hits_correct', hits_correct)
    // console.log(`${hits_wrong} hits wrong`)
    const healthPercentage = (this.store.player.metrics.health / 500) * 100;
    const shieldPercentage =
      (this.store.player.metrics.shield / (this.store.level * 3)) * 100;
    const overCharged = this.store.player.metrics.shield > this.store.level * 3;
    const overChargedPre = overCharged ? "<b>" : "";
    const overChargedPost = overCharged ? "</b>" : "";
    $("#healthBar")
      .css({
        width: healthPercentage + "%",
        "background-color":
          this.store.player.metrics.health == 500 ? "#33BB77" : "#F78D1D",
      })
      .html(
        `Units: ${this.store.player.metrics.units}, Health: ${this.store.player.metrics.health},  ${overChargedPre}Shield: ${this.store.player.metrics.shield}/${this.store.level * 3}${overChargedPost}`,
      );
    $("#shieldBar").css({
      width: shieldPercentage + "%",
    });

    return healthPercentage;
  }
}
