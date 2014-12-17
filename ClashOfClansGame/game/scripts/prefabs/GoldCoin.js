GoldCoin = function(x, y, imageName, killOnComplete) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  //---------
  this.coin = Phaser.Animation.generateFrameNames('exports_animation/coinAnimation/coinAnimation_', 0, 23, '.png', 5);
  this.coin_animation = this.animations.add('coin', this.coin, 20, false);
  if(killOnComplete) {
    this.coin_animation.killOnComplete = killOnComplete;
  }
  else {
    this.coin_animation.killOnComplete = true;
  }

  this.play('coin');
  //---------
  // this.tween = game.add.tween(this);
  // this.tween.to({ y: (this.y + 50) }, 300, Phaser.Easing.Linear.None);
  // this.tween.onComplete.add(function() {
  //   this.play('coin');
  // }, this);
  // this.tween.start();
};

GoldCoin.prototype = Object.create(Phaser.Sprite.prototype);
GoldCoin.prototype.constructor = GoldCoin;
GoldCoin.prototype.create = function() {
};
GoldCoin.prototype.update = function() {
};
