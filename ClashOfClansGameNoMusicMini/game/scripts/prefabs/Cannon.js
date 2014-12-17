Cannon = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  this.health = 5;
  this.is_destroyed = false;
  this.cannon_smoke_x_offset = 8;
  this.cannon_smoke_y_offset = 15;
  this.cannonball_x_offset = 20;
  this.cannonball_y_offset = 20;

  this.cannonball_group = game.add.group();
  //--------------------------------------
  this.destroyed_frames = ['exports_animation/cannonDestroyed.png'];
  this.destroyed_animation = this.animations.add('destroyed', this.destroyed_frames, 10, true);
  //-----
  this.rotating_frames = Phaser.Animation.generateFrameNames('exports_animation/cannonRotation/cannonRotation_', 0, 20, '.png', 5);
  this.rotating_animation = this.animations.add('rotating', this.rotating_frames, 10, true);
  //-----
  this.firing_frames = Phaser.Animation.generateFrameNames('exports_animation/cannonFiring/cannonFiring_', 0, 7, '.png', 5);
  this.firing_animation = this.animations.add('firing', this.firing_frames, 10, false);
  //-----
  this.firing_animation.onStart.add(function() {
    if(this.health > 0) {
      if(window.viewable) {
        window.sound.cannon.play();
      }
      // var new_smoke = new SmokeCloud((this.x + this.cannon_smoke_x_offset), (this.y + this.cannon_smoke_y_offset), 'AllGameTextures');
      var new_fire = new CannonBallFire((this.x + this.cannon_smoke_x_offset + 15), (this.y + this.cannon_smoke_y_offset), 'AllGameTextures');
      var new_cannonball = new CannonBall((this.x + this.cannonball_x_offset), (this.y + this.cannonball_y_offset), 'AllGameTextures');
      this.cannonball_group.add(new_cannonball);
    }
  }, this);
  //-----
  this.firing_animation.onComplete.add(function() {
    var firing_delay = (500 + (Math.random() * 1000));
    setTimeout((function() {
      if(!this.is_destroyed) {
        this.play('firing');
      }
    }).bind(this), firing_delay);
  }, this);
  //-----
  //--------------------------------------
  this.animations.currentAnim = this.rotating_animation;
};

Cannon.prototype = Object.create(Phaser.Sprite.prototype);
Cannon.prototype.constructor = Cannon;

Cannon.prototype.create = function() {
};
Cannon.prototype.update = function() {
  if(this.health <= 0) {
    if(this.animations.currentAnim.name != 'destroyed'
       && !this.is_destroyed) {
      this.is_destroyed = true;
      this.play('destroyed');
      if(window.viewable) {
        window.sound.building_destroyed.play();
      }
      var smoke_cloud = new SmokeCloud(this.x, this.y, 'AllGameTextures');
    }
  }
};
Cannon.prototype.checkForSingleSpriteCollisionWithCannonballs = function(spriteToCheckAgainst) {
  if(typeof(spriteToCheckAgainst) != 'undefined') {
    var sprite_rect = new Phaser.Rectangle(spriteToCheckAgainst.x, spriteToCheckAgainst.y, spriteToCheckAgainst.width, spriteToCheckAgainst.height);
    for(var i = 0; i < this.cannonball_group.length; i++) {
      var cannonball_rect = new Phaser.Rectangle(this.cannonball_group.children[i].x, this.cannonball_group.children[i].y, this.cannonball_group.children[i].width, this.cannonball_group.children[i].height);
      if(Phaser.Rectangle.intersects(cannonball_rect, sprite_rect)) {
        this.cannonball_group.children[i].destroy();
        // console.log("collision!!!");
      }
    }
  }
};
Cannon.prototype.performCannonBallCollisionWithSprite = function(spriteToCheckAgainst, cannonball) {
  cannonball.destroy();
};
