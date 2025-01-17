const clack = new Audio("clack.mp3");
export class KeyboardManager {
  constructor(store, stats, renderer, wordManager) {
    this.store = store;
    this.stats = stats;
    this.renderer = renderer;
    this.wordManager = wordManager
  }
  keyHandler(e) {
    this.stats.start_stats();

    var key = String.fromCharCode(e.which);
    if (this.store.chars.indexOf(key) > -1){
      e.preventDefault();
    }
    else {
      return;
    }
    this.store.keys_hit += key;
    if(key == this.store.word[this.store.word_index]) {
      this.store.hits_correct += 1;
      this.store.in_a_row[key] += 1;
    }
    else {
      this.store.hits_wrong += 1;
      this.store.in_a_row[this.store.word[this.store.word_index]] = 0;
      this.store.in_a_row[key] = 0;
      clack.play();
      this.store.word_errors[this.store.word_index] = true;
    }
    this.store.word_index += 1;
    if (this.store.word_index >= this.store.word.length) {
      setTimeout(this.wordManager.next_word.bind(this.wordManager), 50);
    }

    this.stats.updateStats(this.store.hits_wrong, this.store.hits_correct);

    this.renderer.render();
    this.store.saveToLocalStorage();
  }
}
