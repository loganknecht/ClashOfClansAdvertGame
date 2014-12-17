GUIUnitTracker = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  this.times_zero_frames = ['backgrounds/x0.png'];
  this.times_one_frames = ['backgrounds/x1.png'];
  this.times_two_frames = ['backgrounds/x2.png'];
  this.times_three_frames = ['backgrounds/x3.png'];
  this.times_four_frames = ['backgrounds/x4.png'];
  this.times_five_frames = ['backgrounds/x5.png'];

  this.times_zero_animation = this.animations.add('zero', this.times_zero_frames, 10, false);
  this.times_one_animation = this.animations.add('one', this.times_one_frames, 10, false);
  this.times_two_animation = this.animations.add('two', this.times_two_frames, 10, false);
  this.times_three_animation = this.animations.add('three', this.times_three_frames, 10, false);
  this.times_four_animation = this.animations.add('four', this.times_four_frames, 10, false);
  this.times_five_animation = this.animations.add('five', this.times_five_frames, 10, false);

  this.play('five');

  this.units_available_to_deploy = 5;
};
GUIUnitTracker.prototype = Object.create(Phaser.Sprite.prototype);
GUIUnitTracker.prototype.constructor = GUIUnitTracker;
GUIUnitTracker.prototype.create = function() {
  // this.updateAnimationBasedOnUnitsAvailable();
};
GUIUnitTracker.prototype.update = function() {
};
GUIUnitTracker.prototype.configure = function(new_units_available_to_deploy) {
  // console.log("configured");
  this.units_available_to_deploy = new_units_available_to_deploy;
  this.updateAnimationBasedOnUnitsAvailable();
};
GUIUnitTracker.prototype.lowerUnitCount = function() {
  if(this.units_available_to_deploy > 0) {
    this.units_available_to_deploy--;
  }
  this.updateAnimationBasedOnUnitsAvailable();
};
GUIUnitTracker.prototype.updateAnimationBasedOnUnitsAvailable = function() {
  if(this.units_available_to_deploy == 0) {
    this.play('zero');
  }
  else if(this.units_available_to_deploy == 1) {
    this.play('one');
  }
  else if(this.units_available_to_deploy == 2) {
    this.play('two');
  }
  else if(this.units_available_to_deploy == 3) {
    this.play('three');
  }
  else if(this.units_available_to_deploy == 4) {
    this.play('four');
  }
  else if(this.units_available_to_deploy == 5) {
    this.play('five');
  }
  else {
    this.visible = false;
  }
};
