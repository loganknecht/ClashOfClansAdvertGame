CannonBall = function(x, y, imageName, loopAnimation, killOnComplete) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.velocity.x = 256;
  this.body.velocity.y = 256;

  //---------
  this.cannonball_frames = ['exports_animation/cannonAmmo.png'];
  this.cannonball_animation = this.animations.add('cannonball', this.cannonball_frames, 10, true);

  this.play('cannonball');
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

CannonBall.prototype = Object.create(Phaser.Sprite.prototype);
CannonBall.prototype.constructor = CannonBall;
CannonBall.prototype.create = function() {
};
CannonBall.prototype.update = function() {
};
