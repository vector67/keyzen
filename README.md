
## About

This project was inspired by [Keyzen Colemak](http://first20hours.github.com/keyzen-colemak/), which was implemented by Josh Kaufman, and featured in his **The First 20 Hours** book (one of his challenges is to learn Colemak in 20 hours).

Kaufman's project is based on [Keyzen](https://github.com/wwwtyro/keyzen) which has numerous changes since he cloned it. So, I've used the original Keyzen repo and based my fork from it and added features/improvements that I think were lacking. Personally, I use this everyday upon waking up to strengthen my grasp of the entire alphabet since most of the time I practice on common letters only (i.e. bigrams, trigrams, Top 200 words, etc).

Aside from my added features, I modified also the default `error` sound to make it more pleasant, and updated the `jQuery` library to latest version since the bundled version is 10 years old already. This will make it easier for others to extend the code.


## Features
* Character sequences are spitted gradually and randomly, starting with the most important ones. Home row, top row, then bottom row.
* If you commit mistakes, the letters will be reintroduced again for better feedback loop and to maximize learning. 
* Intensity/rigor could be adjusted.
* Speed/accuracy stats are displayed.
* Characters could be reset/skipped by clicking on it.
* Keyboard images are displayed depending on your layout as a handy reference and to discourage looking into the physical keyboard.
* There's a timer to keep track your progress, or to have a rough idea on how much time you spend on it for better planning.
* Useful for beginners to familiarize the keys.
* Useful for experienced users to strengthen their weaknesses (e.g. training on specific letters, numbers, capital letters, punctuations, etc).
* Keyboard layout could be chosen. Colemak DH (angle/ergo mod) is the recommended one for maximum gains since it encourages using the curling technique.
* QWERTY is included for legacy purposes and for promoting touch typing generally to people.


## Hosted Version
If you're online, you could access it here:
https://ranelpadon.github.io/keyzen-colemak-dh/


## Local Version/Installation
If you're offline, or GitHub Pages is not accessible, or want to modify some parts and run it locally, you could easily do that using a local web server. Here are samples using the mainstream Python/PHP utilities:


1. [Download the repo](https://github.com/ranelpadon/keyzen-colemak-dh/archive/master.zip) and unzip it in your local.

2. Go to the unzipped folder, and start the local server.
    - Python
        - Python 2
            - `python -m SimpleHTTPServer`
        - Python 3
            - `python3 -m http.server`
    - PHP
        - `php -S 0.0.0.0:8000`

3. Go to `http://0.0.0.0:8000` in your browser.


