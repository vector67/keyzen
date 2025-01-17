export class UiHelper {
  constructor(store, renderer, wordManager, eventManager) {
    this.store = store;
    this.renderer = renderer;
    this.wordManager = wordManager;
    this.eventManager = eventManager;
  }
  async skip_to_next_file() {
    await this.wordManager.get_repositories();
    await this.skip_to_next_word();
  }

  async skip_to_next_line() {
    this.store.word = await this.wordManager.generate_word();
    this.store.word_index = 0;
    this.store.keys_hit = "";
    this.store.word_errors = {};
    this.renderer.render();
    this.store.saveToLocalStorage();
  }

  async increase_level() {
    let newLevel = this.store.level + 10;
    if (newLevel > 90) {
      newLevel = 20;
    }
    this.eventManager.dispatch('levelChanged', { level: newLevel})
  }
}
