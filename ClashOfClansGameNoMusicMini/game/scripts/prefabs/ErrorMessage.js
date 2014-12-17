ErrorMessage = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);
  this.alpha_tween_in = game.add.tween(this);
  this.alpha_tween_out = game.add.tween(this);

  game.add.existing(this);
};

ErrorMessage.prototype = Object.create(Phaser.Sprite.prototype);
ErrorMessage.prototype.constructor = ErrorMessage;
ErrorMessage.prototype.create = function() {
};
ErrorMessage.prototype.update = function() {
};
ErrorMessage.prototype.fadeIn = function(fade_speed) {
  if(!this.alpha_tween_in.isRunning
     && !this.alpha_tween_out.isRunning) {
    this.alpha_tween_in = game.add.tween(this);
    this.alpha_tween_in.to({ alpha: 1 }, fade_speed, Phaser.Easing.Linear.None);
    this.alpha_tween_in.start();
  }
};
ErrorMessage.prototype.fadeOut = function(fade_speed) {
  // this.alpha_tween_in = game.add.tween(this);
  if(!this.alpha_tween_in.isRunning
     && !this.alpha_tween_out.isRunning) {
    this.alpha_tween_out = game.add.tween(this);
    this.alpha_tween_out.to({ alpha: 0 }, fade_speed, Phaser.Easing.Linear.None);
    this.alpha_tween_out.start();
  }
};
ErrorMessage.prototype.fadeInThenOut = function(fade_speed) {
  if(!this.alpha_tween_in.isRunning
     && !this.alpha_tween_out.isRunning) {
    this.alpha_tween_in = game.add.tween(this);
    this.alpha_tween_out = game.add.tween(this);

    // console.log("fading");
    this.alpha_tween_in.to({ alpha: 1 }, fade_speed, Phaser.Easing.Linear.None);
    this.alpha_tween_in.onComplete.add(function() {
      this.alpha_tween_out.to({ alpha: 0 }, fade_speed, Phaser.Easing.Linear.None);
      this.alpha_tween_out.start();
    }, this);
    this.alpha_tween_in.start();
  }
};
