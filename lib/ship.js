const MovingObject = require("./moving_objects.js");
const Util = require("./utils.js");
const Bullet = require("./bullet.js");

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