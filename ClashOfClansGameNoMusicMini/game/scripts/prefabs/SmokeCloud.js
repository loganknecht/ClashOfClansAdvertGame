SmokeCloud = function(x, y, imageName, loopAnimation, killOnComplete) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);

  //---------
  this.smoke_frames = Phaser.Animation.generateFrameNames('exports_animation/cannonFiringSmoke/cannonFiringSmoke_', 0, 6, '.png', 5);
  this.smoke_animation = this.animations.add('smoke', this.smoke_frames, 20, false);

  this.smoke_animation.killOnComplete = true;


  this.play('smoke');
};

SmokeCloud.prototype = Object.create(Phaser.Sprite.prototype);
SmokeCloud.prototype.constructor = SmokeCloud;
SmokeCloud.prototype.create = function() {
};
SmokeCloud.prototype.update = function() {
};
