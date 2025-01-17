export class Stats {
  start_time;
  hpm;
  ratio;
  keys_per_mistake;
  constructor(store, eventManager) {
    this.store = store;
    this.eventManager = eventManager;
    this.eventManager.subscribe('playerLost', (() => {
      this.updateStats(0, 0);
    }).bind(this));
  }

  start_stats () {
    this.start_time = this.start_time || Math.floor(new Date().getTime() / 1000);
  }

  updateStats (hits_wrong, hits_correct) {
    if (this.start_time) {
      var current_time = (Math.floor(new Date().getTime() / 1000));
      this.ratio = Math.floor(
        hits_correct / (hits_correct + hits_wrong) * 100
      );
      this.keys_per_mistake = hits_correct / hits_wrong;

      this.hpm = Math.floor(
        (hits_correct + hits_wrong) / (current_time - this.start_time) * 60
      );
      if (!isFinite(this.hpm)) { this.hpm = 0; }
    }
  }
  render_stats_and_level_bar (hits_wrong, hits_correct) {
    $("#stats").text([
      "raw WPM: ", this.hpm / 5, " ",
      "accuracy: ", this.ratio, "% ",
      "letters per mistake: ", Math.floor(this.keys_per_mistake)
    ].join(""));
    // console.log('consecutive', this.store.consecutive, 'hits_wrong', hits_wrong, 'hits_correct', hits_correct)
    // console.log(`${hits_wrong} hits wrong`)
    const keys_buffer = -(this.store.consecutive * hits_wrong - hits_correct);
    let percentage = 0;
    if (keys_buffer >= 0) {
      percentage = 100;
    } else {
      percentage = Math.pow(1.4, keys_buffer / this.store.consecutive) * 100;
    }
    $('#next-level')
      .css({
        'width': percentage + '%',
        'background-color': this.keys_per_mistake > this.store.consecutive ? '#33BB77' : '#F78D1D' ,
      }).text(keys_buffer + '-' + this.store.player.points);

    if (keys_buffer < -500) {
      this.eventManager.dispatch('playerLost');
    }

    if (keys_buffer > this.store.consecutive * 3) {
      this.eventManager.dispatch('playerGainedPoint')
    }

    return percentage
  }
}
