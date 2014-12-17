Balloon = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  // Animation Configuration Goes Here
  this.floating_frames = ["exports_animation/ballooonFloat/BalloonFloat_00020.png"];
  this.floating_animation = this.animations.add('floating', this.floating_frames, 30, true);
  this.attack_frames = Phaser.Animation.generateFrameNames('exports_animation/balloonAttack/BalloonAttack_', 0, 20, '.png', 5);
  this.attack_animation = this.animations.add('attacking', this.attack_frames, 10, false);
  this.attack_animation.onComplete.add(this.attackAnimationComplete, this);
  // this.play('floating');

  this.current_state = 'none';

  // Target Pathing Config Goes Here
  this.perform_movement_logic = true;
  this.target_position = { x: 0, y: 0 };
  this.arrival_logic_performed = false;
  this.movement_nodes = [];
  this.target_position_buffer_x = 5;
  this.target_position_buffer_y = 5;
  this.movement_speed_x = 1;
  this.movement_speed_y = 1;
  //-------------------------
  this.target_object = null;
  this.damage_per_animation = 3;
  this.bomb_generation_x_offset = -30;
  this.bomb_generation_y_offset = 50;
};

Balloon.prototype = Object.create(Phaser.Sprite.prototype);
Balloon.prototype.constructor = Balloon;

Balloon.prototype.create = function() {
}

Balloon.prototype.update = function() {
  if(this.perform_movement_logic) {
    this.performMovementLogic();
  }
};

//------------------------------------------------------------------------------
// Movement Logic
//------------------------------------------------------------------------------
//new movement array looks like [[x,y],[x,y]]
Balloon.prototype.setTargetPosition = function(new_movement_array, arrival_callback) {
  this.arrival_logic_performed = false;
  if(new_movement_array.length > 0) {
    this.movement_nodes = new_movement_array;

    var new_position = this.movement_nodes.pop();
    this.target_position.x = new_position[0];
    this.target_position.y = new_position[1];

    this.current_state = 'moving';
  }

  if (arrival_callback && typeof(arrival_callback) === "function") {
    this.onArrival = arrival_callback;
  }
};
Balloon.prototype.performMovementLogic = function() {
  if(this.isAtTargetPosition()) {
    if(this.movement_nodes.length > 0) {
      var nextNode = this.movement_nodes.pop();
      this.target_position.x = nextNode[0];
      this.target_position.y = nextNode[1];
    }
  }
  // Actual movement goes here
  else {
    var new_position_offset = { x: 0, y: 0 };
    if(this.position.x < this.target_position.x ) {
      new_position_offset.x += this.movement_speed_x;
    }
    else {
      new_position_offset.x -= this.movement_speed_x;
    }
    if(this.position.y < this.target_position.y ) {
      new_position_offset.y += this.movement_speed_y;
    }
    else {
      new_position_offset.y -= this.movement_speed_y;
    }

    //performs buffer logic if needed
    var performXLockOn = false;
    var performYLockOn = false;

    //checks if in buffer range for x
    if((this.position.x < (this.target_position.x + this.target_position_buffer_x))
       && (this.position.x > (this.target_position.x - this.target_position_buffer_x))) {
      performXLockOn = true;
    }
    //checks if in buffer range for x
    if((this.position.y < (this.target_position.y + this.target_position_buffer_y))
       && (this.position.y > (this.target_position.y - this.target_position_buffer_y))) {
      performYLockOn = true;
    }
    //performs actual movement logic
    if(performXLockOn) {
      this.position.x = this.target_position.x;
    }
    else {
      this.position.x += new_position_offset.x;
    }
    if(performYLockOn) {
      this.position.y = this.target_position.y;
    }
    else {
      this.position.y += new_position_offset.y;
    }
  }

  if(this.isAtFinalTargetPosition()) {
    if(!this.arrival_logic_performed) {
      this.onArrival();
      this.arrival_logic_performed = true;
    }
  }
};
Balloon.prototype.isAtTargetPosition = function() {
  if(this.position.x == this.target_position.x
     && this.position.y == this.target_position.y) {
    return true;
  }
  else {
    return false;
  }
};
Balloon.prototype.isAtFinalTargetPosition = function() {
  if(this.position.x == this.target_position.x
     && this.position.y == this.target_position.y
     && this.movement_nodes.length == 0) {
    return true;
  }
  else {
    return false;
  }
};
Balloon.prototype.onArrival = function() {
  // console.log("on arrival");
  this.play('attacking');
  this.current_state = 'attacking';
};
Balloon.prototype.defaultOnArrival = function() {
  // console.log("on arrival");
  this.current_state = 'attacking';
  this.attackAnimationComplete();
};
// End of Movement Logic
Balloon.prototype.attackAnimationComplete = function(sprite, animation) {
  if(this.current_state == 'attacking') {
    if(window.viewable) {
      window.sound.balloon_hit.play();
    }
    if(this.target_object != null) {
      this.target_object.health -= this.damage_per_animation;
    }
    var new_bomb = new Bomb((this.x + this.bomb_generation_x_offset), (this.y + this.bomb_generation_y_offset), 'AllGameTextures');
    this.play('attacking');
  }
};
