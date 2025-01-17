import { Player } from './player.js'

export class Store {
  chars = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*(){}?+_|[]/=-\\\',."<>`~:;'
  consecutive = 30;
  word_length = 7;
  word_index = 0;
  current_layout = "colemak-dh";
  custom_chars = '';
  hits_correct = 0;
  hits_wrong = 0;

  constructor(player, eventManager) {
    this.in_a_row = {};
    for(var i = 0; i < this.chars.length; i++) {
      this.in_a_row[this.chars[i]] = this.consecutive;
    }
    // this.in_a_row[this.chars[l]] = 0;
    this.word_errors = {};
    // this.word = await generate_word();
    // 
    this.word = 'test';
    this.keys_hit = "";
    this.hits_wrong = 0;
    this.hits_correct = 0;
    this.repositories = [];
    this.currentFile = [];
    this.currentIndex = -1;

    this.player = player;
    this.eventManager = eventManager;

    this.eventManager.subscribe('playerLost', (() => {
      this.hits_wrong = 0;
      this.hits_correct = 0;
      this.player.reset();
    }).bind(this));

    this.eventManager.subscribe('playerGainedPoint', (() => {
      this.hits_correct -= this.consecutive;
      this.player.points += 1;
    }).bind(this));
  }

  restoreFromLocalStorage() {
    const data = JSON.parse(localStorage.data);
    this.chars = data.chars;
    this.consecutive = data.consecutive;
    this.word_length = data.word_length;
    this.current_layout = data.current_layout;
    this.custom_chars = data.custom_chars;
    this.hits_correct = data.hits_correct;
    this.hits_wrong = data.hits_wrong;
    this.word = data.word;
    this.word_index = data.word_index;
    this.word_errors = data.word_errors;
    this.keys_hit = data.keys_hit;
    this.in_a_row = data.in_a_row;

    this.repositories = data.repositories;
    this.fileName = data.fileName;
    this.currentFile = data.currentFile;
    this.currentIndex = data.currentIndex;

    console.log('initializing with', data.player);
    this.player = new Player(data.player);
    console.log('some player now has', this.player.points)
  }
  saveToLocalStorage() {
    const data = {};
    data.chars = this.chars;
    data.consecutive = this.consecutive;
    data.word_length = this.word_length;
    data.current_layout = this.current_layout;
    data.custom_chars = this.custom_chars;
    data.hits_correct = this.hits_correct;
    data.hits_wrong = this.hits_wrong;
    data.word = this.word
    data.word_index = this.word_index;
    data.word_errors = this.word_errors;
    data.keys_hit = this.keys_hit;
    data.in_a_row = this.in_a_row;

    data.repositories = this.repositories;
    data.fileName = this.fileName;
    data.currentFile = this.currentFile;
    data.currentIndex = this.currentIndex;

    data.player = this.player.toObject();

    localStorage.data = JSON.stringify(data);
  }

}
