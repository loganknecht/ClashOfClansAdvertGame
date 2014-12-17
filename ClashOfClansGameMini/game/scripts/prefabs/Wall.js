Wall = function(x, y, imageName, wallPiece) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);
  this.destroyed_smoke_created = false;
  this.smoke_x_offset = 0;
  this.smoke_y_offset = 0;

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  // this.walk_north_frames = Phaser.Animation.generateFrameNames('animations/goblinWalkNorth&East/goblinWalkNorth_', 0, 8, '.png', 5);
  // this.walk_north_animation = this.animations.add('walking_north', this.walk_north_frames, 10, true);

  this.front_fence_first_piece_frames = ['backgrounds/balloon/frontfence/firstPiece.png'];
  this.front_fence_first_piece_animation = this.animations.add('front_fence_first_piece', this.front_fence_first_piece_frames, 10, false);

  this.front_fence_other_piece_frames = ['backgrounds/balloon/frontfence/otherPiece.png'];
  this.front_fence_other_piece_animation = this.animations.add('front_fence_other_piece', this.front_fence_other_piece_frames, 10, false);

  this.front_fence_destroyed_piece_frames = ['backgrounds/balloon/frontfence/fenceDestroyed.png'];
  this.front_fence_destroyed_piece_animation = this.animations.add('front_fence_destroyed_piece', this.front_fence_destroyed_piece_frames, 10, false);

  if(wallPiece == 'first') {
    this.play('front_fence_first_piece');
  }
  else if(wallPiece == 'other') {
    this.play('front_fence_other_piece');
  }
  else if(wallPiece == 'destroyed') {
    this.play('front_fence_destroyed_piece');
  }
  else {
    this.play('front_fence_other_piece');
  }

 // backgrounds/balloon/frontfence/firstPiece.png
  this.health = 10;
};

Wall.prototype = Object.create(Phaser.Sprite.prototype);
Wall.prototype.constructor = Wall;
Wall.prototype.create = function() {
};
Wall.prototype.update = function() {
  if(this.health <= 0) {
    // console.log("destroying");
    //doesn't really remove the reference above it in the level
    // this.destroy();
    if(!this.destroyed_smoke_created) {
      this.destroyed_smoke_created = true;
      this.play('front_fence_destroyed_piece');
      var new_smoke = new SmokeCloud((this.x + this.smoke_x_offset), (this.y + this.smoke_y_offset), 'AllGameTextures');
      if(window.viewable) {
        window.sound.building_destroyed.play();
      }
    }
  }
};
