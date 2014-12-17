Bomb = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  //---------
  this.regular_bomb_frames = ['exports_animation/balloonGuyBomb.png'];
  this.regular_bomb_animation = this.animations.add('regular_bomb', this.regular_bomb_frames, 10, false);
  this.bomb_impact_frames = Phaser.Animation.generateFrameNames('exports_animation/balloonBombImpact/bombImpact_', 0, 24, '.png', 5);
  this.bomb_impact_animation = this.animations.add('bomb_impact', this.bomb_impact_frames, 20, false);
  this.bomb_impact_animation.onComplete.add(function() {
    // this.destroy();
    this.kill();
  }, this);

  this.play('regular_bomb');
  //---------
  this.tween = game.add.tween(this);
  this.tween.to({ y: (this.y + 50) }, 300, Phaser.Easing.Linear.None);
  this.tween.onComplete.add(function() {
    this.play('bomb_impact');
    var bomb_smoke = new SmokeCloud(this.x, this.y, 'AllGameTextures');
  }, this);
  this.tween.start();
};

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;
Bomb.prototype.create = function() {
};
Bomb.prototype.update = function() {
};
