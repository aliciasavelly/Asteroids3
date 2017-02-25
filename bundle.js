/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(2);
const MovingObject = __webpack_require__(1);

BULLET = {
  RADIUS: 5,
  COLOR: "#00d60a"
}

function Bullet(options) {
  options.color = BULLET.COLOR;
  options.radius = BULLET.RADIUS;

  MovingObject.call(this, options);
}

Util.inherits(Bullet, MovingObject);

Bullet.prototype.isWrappable = false;

module.exports = Bullet;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

function MovingObject(options, game) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.isWrappable = true;

MovingObject.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
  ctx.fillStyle = this.color;
  ctx.fill();
};

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];

  if (!this.isWrappable && this.game.isOutOfBounds(this.pos)) {
    this.game.remove(this);
  } else {
    this.pos = this.game.wrap(this.pos);
  }
};

MovingObject.prototype.isCollidedWith = function(otherObject) {
  const xdiff = this.pos[0] - otherObject.pos[0];
  const ydiff = this.pos[1] - otherObject.pos[1];

  const dist = Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
  return dist < this.radius + otherObject.radius;
};

MovingObject.prototype.collideWith = function(otherObject) {};

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

const Util = {
  inherits(ChildClass, ParentClass) {
    ChildClass.prototype = Object.create(ParentClass.prototype);
    ChildClass.prototype.constructor = ChildClass;
  },

  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

  // Scale the length of a vector by the given amount.
  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  }

};


module.exports = Util;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(2);
const MovingObject = __webpack_require__(1);
const Ship = __webpack_require__(5);
const Bullet = __webpack_require__(0);

const AST_DEFAULTS = {
  COLOR: "#4decf2",
  RADIUS: 10
};

const NUM_TURNS = 5;
let TURNS_TAKEN = 0;

function Asteroid(options) {
  options.color = AST_DEFAULTS.COLOR;
  options.radius = AST_DEFAULTS.RADIUS;
  options.vel = Util.randomVec(5);

  MovingObject.call(this, options);
}

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.collideWith = function(otherObject) {
  if (otherObject instanceof Ship) {
    TURNS_TAKEN += 1;
    if (TURNS_TAKEN >= NUM_TURNS) {
      this.game.remove(otherObject);
      alert('GAME OVER!! Refresh to try again!');
      // otherObject.vel = [0, 0];
    } else {
      otherObject.relocate();
    }
  } else if (otherObject instanceof Bullet) {
    this.game.remove(otherObject);
    this.game.remove(this);
  }
};

module.exports = Asteroid;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Asteroid = __webpack_require__(3);
const Bullet = __webpack_require__(0);
const Ship = __webpack_require__(5);
const Util = __webpack_require__(2)

function Game() {
  this.asteroids = this.addAsteroids();
  this.bullets = [];
  new_ship = new Ship({ pos: this.randomPosition(), game: this });
  this.ships = [new_ship];
  this.createImage();
}

Game.DIM_X = window.innerWidth;
Game.DIM_Y = window.innerHeight;
Game.NUM_ASTEROIDS = 8;

Game.prototype.createImage = function() {
  const img = new Image();
  img.onload = () => {
    this.img = img;
  }
  img.src = 'https://static.pexels.com/photos/107956/pexels-photo-107956.jpeg';
}

Game.prototype.addAsteroids = function() {
  const asteroids = [];
  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
    const a = new Asteroid({ pos: this.randomPosition(), game: this });
    asteroids.push(a);
  }
  return asteroids;
};

Game.prototype.randomPosition = function() {
  return [Math.random() * Game.DIM_X, Math.random() * Game.DIM_Y];
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.drawImage(this.img, 0, 0, Game.DIM_X, Game.DIM_Y);
  this.allObjects().forEach(obj => obj.draw(ctx));
};

Game.prototype.moveObjects = function() {
  this.allObjects().forEach(obj => obj.move());
};

Game.prototype.wrap = function(pos) {
  const pos2 = [...pos];
  if (pos2[0] <= 0) { pos2[0] = Game.DIM_X; }
  else if (pos2[0] >= Game.DIM_X) { pos2[0] = 0; }

  if (pos2[1] <= 0) { pos2[1] = Game.DIM_Y; }
  else if (pos2[1] >= Game.DIM_Y) { pos2[1] = 0; }
  return pos2;
};

Game.prototype.checkCollisions = function() {
  const objects = this.allObjects();
  for (let i = 0; i < objects.length - 1; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      if (objects[i].isCollidedWith(objects[j])) {
        objects[i].collideWith(objects[j]);
      }
    }
  }
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

Game.prototype.remove = function(obj) {
  if (obj instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(obj), 1);
  } else if (obj instanceof Asteroid) {
    this.asteroids.splice(this.asteroids.indexOf(obj), 1);
  } else if (obj instanceof Ship) {
    this.ships.splice(this.ships.indexOf(obj), 1);
  }
};

Game.prototype.allObjects = function() {
  return [...this.asteroids, ...this.bullets, ...this.ships];
};

Game.prototype.isOutOfBounds = function(pos) {
  return (pos[0] < 0) || (pos[0] > Game.DIM_X) || (pos[1] < 0) || (pos[1] > Game.DIM_Y);
}

module.exports = Game;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Util = __webpack_require__(2);
const Bullet = __webpack_require__(0);

DEFAULTS = {
  RADIUS: 20,
  COLOR: "#e24a4a"
}

function Ship(options) {
  options.radius = DEFAULTS.RADIUS;
  options.vel = [0, 0];
  options.color = DEFAULTS.COLOR;

  MovingObject.call(this, options);
}

Util.inherits(Ship, MovingObject);

Ship.prototype.relocate = function() {
  this.pos = this.game.randomPosition();
  // this.vel = [0, 0];
};

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];

  this.maintainVel(0);
  this.maintainVel(1);
};

Ship.prototype.maintainVel = function(coord) {
  if (this.vel[coord] < -9) {this.vel[coord] = -9}
  if (this.vel[coord] > 9) {this.vel[coord] = 9}
};

Ship.prototype.fireBullet = function() {
  const bullet_velocity = [this.vel[0] * 4, this.vel[1] * 4];
  
  if (this.vel[0] === 0 && this.vel[1] === 0) {
    bullet_velocity[0] = 3;
    bullet_velocity[1] = 3;
  }

  const b = new Bullet({pos: this.pos, vel: bullet_velocity, game: this.game});
  this.game.bullets.push(b);
};

module.exports = Ship;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(4);

function GameView(ctx) {
  this.game = new Game;
  this.ctx = ctx;
}

GameView.prototype.start = function() {
  this.bindKeyHandlers();

  setInterval(() => {
    this.game.step();
    this.game.draw(this.ctx);
  }, 20);
};

GameView.prototype.bindKeyHandlers = function() {
  key('down', () => this.game.ships[0].power([0, 1]) );
  key('up', () => this.game.ships[0].power([0, -1]) );
  key('left', () => this.game.ships[0].power([-1, 0]) );
  key('right', () => this.game.ships[0].power([1, 0]) );
  key('space', () => this.game.ships[0].fireBullet() );
};

module.exports = GameView;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

//same as astreroids.js in directions

const GameView = __webpack_require__(6);
const Asteroid = __webpack_require__(3);
const Game = __webpack_require__(4);

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementById("game-canvas");
  canvasEl.height = window.innerHeight;
  canvasEl.width = window.innerWidth;
  const ctx = canvasEl.getContext('2d');

  new GameView(ctx).start();
});


/***/ })
/******/ ]);