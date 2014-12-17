CannonBallFire = function(x, y, imageName, loopAnimation, killOnComplete) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.65, 0.65);

  game.add.existing(this);

  //---------
  this.fire_frames = Phaser.Animation.generateFrameNames('exports_animation/cannonFire/cannonFire_', 1, 12, '.png', 5);
  this.fire_animation = this.animations.add('CannonBallFire', this.fire_frames, 40, false);
  this.fire_animation.killOnComplete = true;

  this.play('CannonBallFire');
};

CannonBallFire.prototype = Object.create(Phaser.Sprite.prototype);
CannonBallFire.prototype.constructor = CannonBallFire;
CannonBallFire.prototype.create = function() {
};
CannonBallFire.prototype.update = function() {
};
