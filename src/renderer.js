export class Renderer {
  constructor(store, stats, particles, eventManager) {
    this.store = store;
    this.stats = stats;
    this.particles = particles;
    particles.initializeParticleSystem();
    this.eventManager = eventManager;
    this.eventManager.subscribe(
      "playerLost",
      (() => {
        this.render();
      }).bind(this),
    );
    this.eventManager.subscribe(
      "levelChanged",
      (() => {
        this.render_level();
      }).bind(this),
    );
  }
  render() {
    this.render_before_words();
    this.render_word();
    this.render_level();
    const percentage = this.stats.render_stats_and_level_bar(
      this.store.hits_wrong,
      this.store.hits_correct,
    );
    this.particles.setPercentageComplete(percentage / 100);
    this.render_file_progress();
  }
  render_before_words() {
    let lines = "";
    if (this.store.currentIndex != 0) {
      let minLine = Math.max(0, this.store.currentIndex - 5);
      let maxLine = this.store.currentIndex - 1;
      lines =
        "<p>" +
        this.store.currentFile.slice(minLine, maxLine).join("<br>") +
        "</p>";
    }
    $("#lines-before").html(lines.replaceAll(" ", "&nbsp;"));
  }

  render_word() {
    var word = "";
    for (var i = 0; i < this.store.word.length; i++) {
      let sclass = "normalChar";
      if (i > this.store.word_index) {
        sclass = "normalChar";
      } else if (i == this.store.word_index) {
        sclass = "currentChar";
      } else if (this.store.word_errors[i]) {
        sclass = "errorChar";
      } else {
        sclass = "goodChar";
      }
      word += "<span class='" + sclass + "'>";
      if (this.store.word[i] == " ") {
        if (this.store.word_errors[i]) {
          word += "&#9141;";
        } else {
          word += "&nbsp;";
        }
      } else if (this.store.word[i] == "&") {
        word += "&amp;";
      } else {
        word += this.store.word[i];
      }
      word += "</span>";
    }
    var keys_hit = "<span class='keys-hit'>";
    for (var d in this.store.keys_hit) {
      if (this.store.keys_hit[d] == " ") {
        keys_hit += "&nbsp;";
      } else if (this.store.keys_hit[d] == "&") {
        keys_hit += "&amp;";
      } else if (this.store.keys_hit[d] == "<") {
        keys_hit += "&lt;";
      } else {
        keys_hit += this.store.keys_hit[d];
      }
    }
    for (var i = this.store.word_index; i < this.store.word_length; i++) {
      keys_hit += "&nbsp;";
    }
    keys_hit += "</span>";
    $("#word").html(word + "<br>" + keys_hit);
  }
  render_level() {
    let chars =
      "<span id='rigor-number' onclick='functions.increase_level();'>";
    chars += "" + this.store.level;
    chars += "<span>";
    $("#rigor").html("letters per mistake goal: " + chars);
  }

  render_file_progress() {
    // console.log('rendering file progress',`${this.store.currentIndex}/${this.store.currentFile.length}`);
    $("#fileProgress").html(
      `<span>${this.store.currentIndex}/${this.store.currentFile.length} - ${this.store.fileName}</span>`,
    );
  }
}
