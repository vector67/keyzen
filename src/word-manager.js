import { get_bearer_token } from '../env.js';
const LANGUAGE = 'erlang';
const LANGUAGE_FILE_ENDING = '.erl';

export class WordManager {
  constructor(store, stats, renderer) {
    this.store = store;
    this.stats = stats;
    this.renderer = renderer;
  }
  async generate_word() {
    let nextLine = '';
    do {
      if (this.store.currentIndex == -1 || this.store.currentIndex >= this.store.currentFile.length) {
        await this.get_repositories();
      }
      nextLine = this.store.currentFile[this.store.currentIndex++].trim();
    } while (!nextLine && nextLine.length < 120);

    console.log('current word/line', '"' + nextLine + '"');
    this.store.word_length = nextLine.length;
    this.renderer.render_file_progress();
    return nextLine;
  }
  async next_word(){
    this.store.word = await this.generate_word();
    this.store.word_index = 0;
    this.store.keys_hit = "";
    this.store.word_errors = {};
    this.stats.updateStats(this.store.hits_wrong, this.store.hits_correct);

    this.renderer.render();
    this.store.saveToLocalStorage();
  }

  async get_repositories() {
    if (!this.store.repositories.length) {
      this.store.repositories = (await (await fetch(`https://api.github.com/search/repositories?q=language:${LANGUAGE}&sort=stars&order=desc`, {headers: { "Authorization" : get_bearer_token()}})).json()).items;
    }
    const repository = this.store.repositories[Math.floor(Math.random() * this.store.repositories.length)]
    const branch = await (await fetch(`${repository.url}/branches/${repository.default_branch}`, { headers: { "Authorization": get_bearer_token() }})).json();
    const tree = await (await fetch(`${branch.commit.commit.tree.url}?recursive=true`, { headers: { "Authorization": get_bearer_token()}})).json();
    const js_files = tree.tree.map((file) => ({name: file.path, url: file.url})).filter((file) => file.name.endsWith(LANGUAGE_FILE_ENDING));
    if (!js_files.length) {
      await get_repositories();
      return;
    }
    const randomFile = js_files[Math.floor(Math.random() * js_files.length)];
    console.log('randomFile', randomFile, js_files);
    const fileContent = (await (await fetch(randomFile.url, { headers: { "Authorization": get_bearer_token() }})).json()).content;
    this.store.currentFile = atob(fileContent).split('\n');
    this.store.fileName = randomFile.name;
    this.store.currentIndex = 0;
  }
}
