import { particles } from '../particles/index.js';
import { Stats } from './stats.js';
import { EventManager } from './event-manager.js';
import { KeyboardManager } from './keyboard-manager.js';
import { WordManager } from './word-manager.js';
import { Store } from './store.js';
import { Renderer } from './renderer.js';
import { UiHelper } from './ui-helper.js'
import { Player } from './player.js'
import { AudioManager } from './audio-manager.js'

export function run() {
  const eventManager = new EventManager();

  const player = new Player(eventManager);
  const store = new Store(player, eventManager);

  particles.initializeParticleSystem();
  const stats = new Stats(store, eventManager);
  const renderer = new Renderer(store, stats, particles, eventManager); 
  const wordManager = new WordManager(store, stats, renderer);
  const keyboardManager = new KeyboardManager(store, stats, renderer, wordManager);
  const audioManager = new AudioManager(eventManager);

  $(document).ready(function() {
    if (localStorage.data != undefined) {
      store.restoreFromLocalStorage();
      renderer.render();
    } else {
      wordManager.next_word();
    }
    $(document).keypress(keyboardManager.keyHandler.bind(keyboardManager));

  });

  return new UiHelper(store, renderer, wordManager);
}


