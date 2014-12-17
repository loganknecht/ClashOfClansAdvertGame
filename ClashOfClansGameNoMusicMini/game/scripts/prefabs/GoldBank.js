GoldBank = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  current_coin = null;
  this.current_coin = current_coin;
  this.current_coin_x_offset = 0;
  this.current_coin_y_offset = -150;

  this.full_frames = ['exports_animation/goldStorage_emptying/goldStorage01.png'];
  this.full_animation = this.animations.add('full', this.full_frames, 10, false);

  this.half_full_frames = ['exports_animation/goldStorage_emptying/goldStorage02.png'];
  this.half_full_animation = this.animations.add('half', this.half_full_frames, 10, false);

  this.quarter_full_frames = ['exports_animation/goldStorage_emptying/goldStorage03.png'];
  this.quarter_full_animation = this.animations.add('quarter', this.quarter_full_frames, 10, false);

  this.empty_frames = ['exports_animation/goldStorage_emptying/goldStorage04.png'];
  this.empty_animation = this.animations.add('empty', this.empty_frames, 10, false);

  this.destroyed_frames = ['exports_animation/goldStorage_emptying/goldStorage05.png'];
  this.destroyed_animation = this.animations.add('destroyed', this.destroyed_frames, 10, false);

  // this.walk_north_frames = Phaser.Animation.generateFrameNames('animations/goblinWalkNorth&East/goblinWalkNorth_', 0, 8, '.png', 5);
  // this.walk_north_animation = this.animations.add('walking_north', this.walk_north_frames, 10, true);
  this.play('full');

  this.max_health = 10;
  this.half_health = 0;
  this.quarter_health = 0;
  this.empty_health = 0;
  this.health = this.max_health;
  this.destroyed_smoke_created = false;
  this.smoke_x_offset = 0;
  this.smoke_y_offset = 0;
};

GoldBank.prototype = Object.create(Phaser.Sprite.prototype);
GoldBank.prototype.constructor = GoldBank;
GoldBank.prototype.create = function() {
};
GoldBank.prototype.update = function() {
  if(this.health <= this.max_health && this.health > this.half_health) {
    if(this.animations.currentAnim.name != 'full') {
      this.play('full');
    }
  }
  else if(this.health <= this.half_health && this.health > this.quarter_health) {
    if(this.animations.currentAnim.name != 'half') {
      this.play('half');
    }
  }
  else if(this.health <= this.half_health && this.health > this.quarter_health) {
    if(this.animations.currentAnim.name != 'half') {
      this.play('half');
    }
  }
  else if(this.health <= this.quarter_health && this.health > this.empty_health) {
    if(this.animations.currentAnim.name != 'quarter') {
      this.play('quarter');
    }
  }
  else if(this.health <= this.empty_health && this.health > 0) {
    if(this.animations.currentAnim.name != 'empty') {
      this.play('empty');
    }
  }
  else {
    if(this.animations.currentAnim.name != 'destroyed') {
      this.play('destroyed');
      if(!this.destroyed_smoke_created) {
        this.destroyed_smoke_created = true;
        // this.play('front_fence_destroyed_piece');
        var new_smoke = new SmokeCloud((this.x + this.smoke_x_offset), (this.y + this.smoke_y_offset), 'AllGameTextures');
        if(window.viewable) {
          window.sound.building_destroyed.play();
        }
      }
    }
  }
  // if(this.health < 0) {
  //   // console.log("destroying");
  //   //doesn't really remove the reference above it in the level
  //   this.destroy();
  // }
};
GoldBank.prototype.configureHealth = function(new_max_health) {
  this.max_health = new_max_health;
  this.half_health = this.max_health*.66;
  this.quarter_health = this.max_health*.44;
  this.empty_health = this.max_health*.22;
  this.health = this.max_health;
};
GoldBank.prototype.generateCoinAnimation = function() {
  if(this.health > 0) {
    if(this.current_coin == null) {
      this.current_coin = new GoldCoin((this.x + this.current_coin_x_offset), (this.y + this.current_coin_y_offset), 'AllGameTextures', false);
      if(window.viewable) {
        window.sound.coin_steal.play();
      }
    }
    else if(this.current_coin.animations.currentAnim.isFinished) {
      this.current_coin = new GoldCoin((this.x + this.current_coin_x_offset), (this.y + this.current_coin_y_offset), 'AllGameTextures', false);
      if(window.viewable) {
        window.sound.coin_steal.play();
      }
    }
  }
};
