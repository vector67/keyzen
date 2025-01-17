export class UiHelper {
  constructor(store, renderer, wordManager) {
    this.store = store;
    this.renderer = renderer;
    this.wordManager = wordManager;
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
    this.store.consecutive += 10;
    if (this.store.consecutive > 90) {
      this.store.consecutive = 20;
    }
    this.renderer.render_level();
  }
}
