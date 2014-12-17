Giant = function(x, y, imageName) {

  //Phaser creation
  Phaser.Sprite.call(this, game, x, y, imageName);

  //Phaser Configurations
  this.anchor.setTo(0.5, 0.5);

  game.add.existing(this);
  // game.physics.enable(this, Phaser.Physics.ARCADE);

  this.run_north_frames = Phaser.Animation.generateFrameNames('exports_animation/giantWalk/giantWalk_', 0, 12, '.png', 5);
  this.run_north_animation = this.animations.add('move_north', this.run_north_frames, 10, true);

  this.run_east_frames = Phaser.Animation.generateFrameNames('exports_animation/giantWalkEast/giantWalkEast_', 0, 12, '.png', 5);
  this.run_east_animation = this.animations.add('move_east', this.run_east_frames, 10, true);

  this.run_west_frames = Phaser.Animation.generateFrameNames('exports_animation/giantWalkWest/giantWalkWest_', 0, 12, '.png', 5);
  this.run_west_animation = this.animations.add('move_west', this.run_west_frames, 10, true);

  this.run_south_frames = Phaser.Animation.generateFrameNames('exports_animation/giantWalkSouth/giantWalkSouth_', 0, 12, '.png', 5);
  this.run_south_animation = this.animations.add('move_south', this.run_south_frames, 10, true);

  this.attack_one_frames = Phaser.Animation.generateFrameNames('exports_animation/giantAttack_01/giantAttackOne_', 0, 8, '.png', 5);
  this.attack_one_animation = this.animations.add('attack_one', this.attack_one_frames, 10, false);

  this.attack_two_frames = Phaser.Animation.generateFrameNames('exports_animation/giantAttack_02/giantAttackTwo_', 0, 9, '.png', 5);
  this.attack_two_animation = this.animations.add('attack_two', this.attack_two_frames, 10, false);


  this.play('attack_one');
  // this.play('move_north');
  // this.play('attackTwo');

  //Custom Configuration
  //standing, attacking
  this.currentState = 'attacking';
  this.randomizeAttackAnimations = true;
  this.attack_one_animation.onComplete.add(this.attackAnimationComplete, this);
  this.attack_two_animation.onComplete.add(this.attackAnimationComplete, this);


  // Target Pathing Config Goes Here
  this.perform_movement_logic = true;
  this.target_position = { x: x, y: y };
  this.arrival_logic_performed = false;
  this.movement_nodes = [];
  this.target_position_buffer_x = 5;
  this.target_position_buffer_y = 5;
  this.movement_speed_x = 1;
  this.movement_speed_y = 1;
  //------------------------------------
  this.target_object = null;
  this.damage_per_animation = 1;
  //------------------------------------
  this.gold_coin_x_offset = 0;
  this.gold_coin_y_offset = -150;
};

Giant.prototype = Object.create(Phaser.Sprite.prototype);
Giant.prototype.constructor = Giant;

Giant.prototype.update = function() {
  if(this.perform_movement_logic) {
    var new_position_offset = this.calculateNextMovementOffset();
    this.updateAnimations(new_position_offset);
    this.performMovementLogic(new_position_offset);
  }
};

//------------------------------------------------------------------------------
// Movement Logic
//------------------------------------------------------------------------------
//new movement array looks like [[x,y],[x,y]]
Giant.prototype.setTargetPosition = function(new_movement_array, arrival_callback) {
  this.arrival_logic_performed = false;
  if(new_movement_array.length > 0) {
    this.movement_nodes = new_movement_array;

    var new_position = this.movement_nodes.pop();
    // console.log("setting to: " + new_position);
    // console.log("x: " + new_position[0]);
    // console.log("y: " + new_position[1]);
    this.target_position.x = new_position[0];
    this.target_position.y = new_position[1];
  }
  this.current_state = 'moving';
  // this.play('walking');
  // this.play('attack_one');
  // this.play('attack_two');

  if (arrival_callback && typeof(arrival_callback) === "function") {
    this.onArrival = arrival_callback;
  }
  else {
    this.onArrival = this.defaultOnArrival;
  }
};
Giant.prototype.calculateNextMovementOffset = function() {
  var new_position_offset = { x: 0, y: 0 };
  if(this.position.x < this.target_position.x ) {
    new_position_offset.x += this.movement_speed_x;
  }
  else if(this.position.x > this.target_position.x ) {
    new_position_offset.x -= this.movement_speed_x;
  }
  if(this.position.y < this.target_position.y ) {
    new_position_offset.y += this.movement_speed_y;
  }
  else if(this.position.y > this.target_position.y ) {
    new_position_offset.y -= this.movement_speed_y;
  }
  // console.log("new position offset x: " + new_position_offset.x + " y: " + new_position_offset.y);
  return new_position_offset;
};
Giant.prototype.updateAnimations = function(new_position_offset) {
  var movingUp = false;
  var movingDown = false;
  var movingLeft = false;
  var movingRight = false;

  //moving left
  if(new_position_offset.x < 0) {
    movingLeft = true;
  }
  //moving right
  else if(new_position_offset.x > 0){
    movingRight = true;
  }
  //at x
  else {
    //do nothing
  }
  //moving up
  if(new_position_offset.y < 0) {
    movingUp = true;
  }
  //moving down
  else if(new_position_offset.y > 0) {
    movingDown = true;
  }
  //at y
  else {
    //do nothing
  }

  // console.log("---------------------------");
  // console.log("Left: " + movingLeft);
  // console.log("Right: " + movingRight);
  // console.log("Up: " + movingUp);
  // console.log("Down: " + movingDown);
  //moving directly up
  if(movingUp && !movingLeft && !movingRight) {
    if(this.animations.currentAnim.name != 'move_north') {
      // console.log("changing to moving up");
      this.play('move_north');
    }
  }
  //moving up and left
  else if(movingUp && movingLeft && !movingRight) {
    if(this.animations.currentAnim.name != 'move_north') {
      // console.log("changing to moving up");
      this.play('move_north');
    }
  }
  //moving up and right
  else if(movingUp && !movingLeft && movingRight) {
    if(this.animations.currentAnim.name != 'move_east') {
      // console.log("changing to moving up right");
      this.play('move_east');
    }
  }
  //moving left
  else if(!movingUp && !movingDown && movingLeft) {
    if(this.animations.currentAnim.name != 'move_west') {
      // console.log("changing to moving left");
      this.play('move_west');
    }
  }
  //moving right
  else if(!movingUp && !movingDown && movingRight) {
    if(this.animations.currentAnim.name != 'move_east') {
      // console.log("changing to moving right");
      this.play('move_east');
    }
  }
  //moving directly down
  if(movingDown && !movingLeft && !movingRight) {
    if(this.animations.currentAnim.name != 'move_north') {
      // console.log("changing to moving down");
      this.play('move_north');
    }
  }
  //moving down and left
  else if(movingDown && movingLeft && !movingRight) {
    if(this.animations.currentAnim.name != 'move_west') {
      // console.log("changing to moving down left");
      this.play('move_west', null, true);
    }
  }
  //moving down and right
  else if(movingDown && !movingLeft && movingRight) {
    if(this.animations.currentAnim.name != 'move_south') {
      // console.log("changing to moving down right");
      this.play('move_south');
    }
  }
  //not moving
  else {
  }
};
Giant.prototype.performMovementLogic = function(new_position_offset) {
  if(this.isAtTargetPosition()) {
    if(this.movement_nodes.length > 0) {
      var nextNode = this.movement_nodes.pop();
      this.target_position.x = nextNode[0];
      this.target_position.y = nextNode[1];
    }
  }
  // Actual movement goes here
  else {

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
Giant.prototype.isAtTargetPosition = function() {
  if(this.position.x == this.target_position.x
     && this.position.y == this.target_position.y) {
    return true;
  }
  else {
    return false;
  }
};
Giant.prototype.isAtFinalTargetPosition = function() {
  if(this.position.x == this.target_position.x
     && this.position.y == this.target_position.y
     && this.movement_nodes.length == 0) {
    return true;
  }
  else {
    return false;
  }
};
Giant.prototype.onArrival = function() {
}
Giant.prototype.defaultOnArrival = function() {
  // console.log("on arrival");
  this.current_state = 'attacking';
  this.attackAnimationComplete();
  var attackAnim = Math.floor(Math.random() * 2);
  if(this.target_object.health  > 0) {
    if(attackAnim == 0) {
      this.play('attack_one');
    }
    else {
      this.play('attack_two');
    }
  }
  else {
    // this.animations.currentAnim.stop();
    this.play('move_north');
    this.animations.currentAnim.stop();
  }
};
// End of Movement Logic
//------------------------------------------------------------------------------
Giant.prototype.attackAnimationComplete = function(sprite, animation) {
  if(this.currentState == 'attacking') {
    //should be a 2-3
    var attack_delay = 2 + Math.floor(Math.random()* 2);
    if(this.target_object != null) {
      // console.log("Giant target_object is not null");
      this.target_object.health -= this.damage_per_animation;
    }
    if(this.randomizeAttackAnimations) {
      var attackAnim = Math.floor(Math.random() * 2);
      // setTimeout(this.triggerLevelChange.bind(this), 500);
      if(attackAnim == 0) {
        setTimeout((function() {
          if(this.target_object != null
             && this.target_object.health > 0) {
            this.play('attack_one');
          }
        }).bind(this), (attack_delay*1000));
      }
      else {
        setTimeout((function() {
          if(this.target_object != null
             && this.target_object.health > 0) {
            this.play('attack_two');
          }
        }).bind(this), (attack_delay*1000));
      }
    }

    if(this.target_object instanceof(GoldBank)
       && this.target_object.health > 0) {
      // console.log('is attacking');
      // var gold_coin = new GoldCoin((this.x + this.gold_coin_x_offset), (this.y + this.gold_coin_y_offset), 'AllGameTextures');
      this.target_object.generateCoinAnimation();
    }
  }
};
