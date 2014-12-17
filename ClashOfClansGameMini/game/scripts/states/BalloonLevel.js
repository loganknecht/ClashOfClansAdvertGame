function BalloonLevel() {
  //var self = this;

  this.background = null;
  this.last_click = [0,0];
};
BalloonLevel.prototype = {
  preload: function() {
    // console.log("balloon level PRELOADING");
  },
  create: function() {
    this.player_summoned_unit = false;
    this.inactive_player_interval = setInterval((function() {
      if(this.gui_unit_tracker.units_available_to_deploy > 0) {
        if(this.player_summoned_unit) {
          this.player_summoned_unit = false;
        }
        else {
          new_balloon = new Balloon(745, 470, 'AllGameTextures');

          var selected_position = this.list_of_end_positions.splice(Math.floor(Math.random()*this.list_of_end_positions.length), 1);

          new_balloon.setTargetPosition(selected_position);
          new_balloon.target_object = this.cannon;
          this.balloon_group.add(new_balloon);
          this.gui_unit_tracker.lowerUnitCount();
        }
      }
      else {
        clearInterval(this.inactive_player_interval);
      }
    }).bind(this), 10000);

    window.event_tracking.balloon_level_played++;
    window.event_tracking.current_level = 'BALLOON_LEVEL';
    CNEventer.send_custom_event('BALLOON_LEVEL_PLAYED');

    this.wall_locations = [[470,540],
                           [530,500],
                           [600,450],
                           [650,405],
                           [705,355]];
    this.fortress_wall_locations = [[470,540],
                           [530,500],
                           [600,450],
                           [650,405],
                           [705,355]];
    // this.list_of_end_positions = [[500,300],[400,400]];
    this.list_of_end_positions = [[365,125],[440,160]];

    console.log("balloon level CREATING");

    this.background = game.add.sprite(0,0, 'grassBackground');

    balloon_fence = game.add.sprite(350, 260, 'balloonFence');
    balloon_fence.anchor.setTo(0.5, 0.5);

    stone_wall = game.add.sprite(360, 260, 'stoneWall');
    stone_wall.anchor.setTo(0.5, 0.5);


    //----------------------------
    untappable_area = game.add.sprite(355, 265, 'untappableThin');
    this.untappable_area =  untappable_area;
    this.untappable_area.anchor.setTo(0.5, 0.5);
    this.untappable_rect = new Phaser.Rectangle(this.untappable_area.x, this.untappable_area.y, this.untappable_area.width*0.7, this.untappable_area.height*0.7);

    this.untappable_areas_fade_out_triggered = false;
    //----------------------------
    // this.untappable_top_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_top_area.scale.setTo( 800, 200);
    // this.untappable_top_area_rect = new Phaser.Rectangle(0, 0, 800, 200);

    // this.untappable_left_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_left_area.scale.setTo(300,600);
    // this.untappable_left_area_rect = new Phaser.Rectangle(0, 0, 300, 600);

    // this.untappable_square_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_square_area.scale.setTo(650,500);
    this.untappable_square_area_rect = new Phaser.Rectangle(0, 0, 650, 500);
    //----------------------------

    this.wall_destroyed_positions_set = false;
    this.wall_group = game.add.group();
    this.generateWallGroup(this.wall_group);

    this.wall_piece_to_destroy = this.wall_group.children[2];
    this.wall_paired_with_wall_piece_to_destroy = this.wall_group.children[3];

    cannon = new Cannon(355, 245, 'AllGameTextures');
    this.cannon = cannon;
    this.cannon.health = 15;
    this.cannon.play('rotating');

    barbarian_group = game.add.group();
    this.barbarian_group = barbarian_group;
    this.generate_level_barbarians();
    for(var i = 0; i < this.barbarian_group.length; i++) {
      var attack_animation = Math.floor(Math.random()*2);
      if(attack_animation == 0) {
        this.barbarian_group.children[i].play('attack_one');
      }
      else {
        this.barbarian_group.children[i].play('attack_two');
      }
    }

    this.balloon_group = game.add.group();

    //----------------------------------
    //Player demo
    //----------------------------------
    // this.player_error_text = game.add.sprite(110, 200, 'errorMessage');
    this.player_error_text = new ErrorMessage(600, 400, 'errorMessage');
    this.player_error_text.alpha = 0;
    // this.configureDemoAnimation();
    //----------------------------------

    this.gui_current_unit_icon = game.add.sprite(180, 674, 'AllGameTextures');
    this.gui_current_unit_icon.frameName = 'backgrounds/balloon/balloonOverlay.png';
    this.gui_current_unit_icon.anchor.setTo(0.5, 0.5);
    this.gui_current_unit_icon.scale.setTo(0.75, 0.75);

    // this.gui_tap_overlay = game.add.sprite(519, 420, 'AllGameTextures');
    this.gui_tap_overlay = game.add.sprite(943, 643, 'AllGameTextures');
    this.gui_tap_overlay.frameName = 'backgrounds/tapOverlay.png';
    this.gui_tap_overlay.anchor.setTo(0.5, 0.5);
    this.gui_tap_overlay.scale.setTo(0.75, 0.75);

    this.gui_unit_tracker = new GUIUnitTracker(175,631,'AllGameTextures');
    this.gui_unit_tracker.configure(2);

    //x, y, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group
    this.gui_install_button = game.add.button(1005, 672, 'AllGameTextures', this.performInstallButtonLogic, this, 'backgrounds/installButton.png', 'backgrounds/installButton.png', 'backgrounds/installButton_down.png', 'backgrounds/installButton.png');
    this.gui_install_button.anchor.setTo(0.5, 0.5);
    this.gui_install_button.scale.setTo(0.75, 0.75);

    this.level_change_triggered = false;
    this.fader = new Fader(600, 400);
    this.fader.startFade(1, 0, 1000);

    if(device_type == 'phone') {
      this.adcLogo = game.add.sprite(1105, 775, 'adcLogo');
      this.adcLogo.anchor.setTo(0.5, 0.5);
    }
    else {
      this.adcLogo = game.add.sprite(1150, 785, 'adcLogo');
      this.adcLogo.anchor.setTo(0.5, 0.5);
      this.adcLogo.scale.setTo(0.5, 0.5);
    }

    this.configureADCLogoAndInstallButton();

    game.input.onDown.add(this.performTouchLogic, this);
  },
  render: function() {
    // game.debug.pointer(game.input.activePointer);
  },
  update: function() {
    if(typeof(window.music) != 'undefined'
       && window.viewable) {
      if(!window.music.isPlaying) {
        window.music.play();
      }
    }
    if(!this.performingDemo) {
      this.performWorldObjectsTrackingLogic();
      if (game.input.keyboard.isDown(Phaser.Keyboard.F)) {
        this.triggerLevelChange();
      }

      //This pairs the wall sections together so I don't have to target more than one section with the barbarians
      this.wall_paired_with_wall_piece_to_destroy.health = this.wall_piece_to_destroy.health;
      this.performCollisionLogic();
    }
  },
  triggerLevelChange: function() {
    if(!this.level_change_triggered) {
      this.level_change_triggered = true;
      for(var i = 0; i < this.balloon_group.children.length; i++) {
        this.balloon_group.children[i].animations.currentAnim.stop();
      }
      this.fader = new Fader(600, 400);
      this.fader.startFade(0, 1, 1000, function() { game.state.start('GoblinLevel'); } );
      if(window.viewable) {
        window.sound.level_end.play();
      }
    }
  },
  performWorldObjectsTrackingLogic: function() {
    if(this.wall_piece_to_destroy.health <= 0
       && this.wall_paired_with_wall_piece_to_destroy.health <= 0
       && !this.wall_destroyed_positions_set) {
      this.wall_destroyed_positions_set = true;
      this.cannon.play('firing');
      for(var i = 0; i < this.barbarian_group.children.length; i++) {
        if(i == 0) {
          this.barbarian_group.children[i].setTargetPosition([[490,275],[475,360]]);
        }
        else if(i == 1) {
          this.barbarian_group.children[i].setTargetPosition([[470,290],[475,360]]);
        }
        else if(i == 2) {
          this.barbarian_group.children[i].setTargetPosition([[430,300],[475,360]]);
        }
        else if(i == 3) {
          this.barbarian_group.children[i].setTargetPosition([[420,330],[475,360]]);
        }
        else if(i == 4) {
          this.barbarian_group.children[i].setTargetPosition([[385,340],[475,360]]);
        }
        else {
          this.barbarian_group.children[i].setTargetPosition([[430,300],[475,360]]);
        }
          this.barbarian_group.children[i].target_object = this.barbarian_group.children[i];
      }
    }

    //cannon
    if(this.cannon.health < 0) {
      for(var i = 0; i < this.balloon_group.children.length; i++) {
      }
      setTimeout(this.triggerLevelChange.bind(this), 0);
    }
  },
  performTouchLogic: function() {
    // fader.startFade(1, 0, 1000);
    // If the button doesn't contain the pointer
    var button_contains_pointer = false;
    if((game.input.activePointer.x > (this.gui_tap_overlay.position.x - this.gui_tap_overlay.width/2))
       && (game.input.activePointer.x < (this.gui_tap_overlay.position.x + this.gui_tap_overlay.width/2))
       && (game.input.activePointer.y > (this.gui_tap_overlay.position.y - this.gui_tap_overlay.height/2))
       && (game.input.activePointer.y < (this.gui_tap_overlay.position.y + this.gui_tap_overlay.height/2))) {
      button_contains_pointer = true;
    }
    var current_unit_icon_contains_pointer = false;
    if((game.input.activePointer.x > (this.gui_current_unit_icon.position.x - this.gui_current_unit_icon.width/2))
       && (game.input.activePointer.x < (this.gui_current_unit_icon.position.x + this.gui_current_unit_icon.width/2))
       && (game.input.activePointer.y > (this.gui_current_unit_icon.position.y - this.gui_current_unit_icon.height/2))
       && (game.input.activePointer.y < (this.gui_current_unit_icon.position.y + this.gui_current_unit_icon.height/2))) {
      current_unit_icon_contains_pointer = true;
    }
    var untappable_area_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_rect.x - this.untappable_rect.width/2))
     && (game.input.activePointer.x < (this.untappable_rect.x + this.untappable_rect.width/2))
     && (game.input.activePointer.y > (this.untappable_rect.y - this.untappable_rect.height/2))
     && (game.input.activePointer.y < (this.untappable_rect.y + this.untappable_rect.height/2))) {
      untappable_area_contains_pointer = true;
    }
    //-------------------------
    var untappable_squares_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_square_area_rect.x))
     && (game.input.activePointer.x < (this.untappable_square_area_rect.width))
     && (game.input.activePointer.y > (this.untappable_square_area_rect.y))
     && (game.input.activePointer.y < (this.untappable_square_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    var insideDiamond = false;
    var top_corner = { x: 365, y: 50 };
    var right_corner = { x: 678, y: 252 };
    var bottom_corner = { x: 345, y: 511 };
    var left_corner = { x: 30, y: 272 };
    var middle = { x: ((left_corner.x + right_corner.x)/2),
                   y: ((top_corner.y + bottom_corner.y)/2) }
    var dx = Math.abs(game.input.activePointer.x - middle.x);
    var dy = Math.abs(game.input.activePointer.y - middle.y);
    // var size = [middle[0] - topDiamond[0][0], middle[1] - topDiamond[0][1]];
    var size = { x: (middle.x - left_corner.x), y: (middle.y - top_corner.y) };
    var both_added = ((dx/size.x) + (dy/size.y));
    if(both_added <= 1) {
      console.log("INSIDE DIAMOND");
      insideDiamond = true;
    }
    else {
      console.log("OUTSIDE DIAMOND");
    }
    //-------------------------

    if(!button_contains_pointer
       && !current_unit_icon_contains_pointer
       && !insideDiamond
       // && !untappable_area_contains_pointer
       // && !untappable_squares_contains_pointer
       && this.fader.fade_finished
       && this.gui_unit_tracker.units_available_to_deploy > 0) {

      window.event_tracking.balloons_summoned++;
      CNEventer.send_custom_event('BALLOONS_SUMMONED');

      this.gui_unit_tracker.lowerUnitCount();
       // && this.list_of_end_positions.length > 0) {
      new_balloon = new Balloon(game.input.activePointer.x, game.input.activePointer.y, 'AllGameTextures');
      // var selected_position = this.list_of_end_positions[Math.floor(Math.random()*this.list_of_end_positions.length)];
      var selected_position = this.list_of_end_positions.splice(Math.floor(Math.random()*this.list_of_end_positions.length), 1);
      // console.log("selected position");
      // console.log([selected_position]);
      // console.log("x: " + selected_position[0] + " y: " + selected_position[1]);
      new_balloon.setTargetPosition(selected_position);
      new_balloon.target_object = this.cannon;
      this.balloon_group.add(new_balloon);

      if(!this.untappable_areas_fade_out_triggered) {
        // console.log("fading out");
        this.untappable_areas_fade_out_triggered = true;
        this.fadeNonTappableAreas();
      }

      this.player_summoned_unit = true;
    }

    // if(untappable_area_contains_pointer
    if(insideDiamond
       && this.gui_unit_tracker.units_available_to_deploy > 0) {
      this.player_error_text.fadeInThenOut(500);
    }
  },
  performInstallButtonLogic: performInstallButtonLogic,
  performCollisionLogic: function() {
    //----------------------
    //collision logic
    //----------------------
    for(var i = 0; i < this.barbarian_group.length; i++) {
      this.cannon.checkForSingleSpriteCollisionWithCannonballs(this.barbarian_group.children[i]);
    }
    //----------------------
  },
  generate_level_barbarians: function() {
    this.generate_barbarian(570, 280, 'AllGameTextures', this.barbarian_group, this.wall_piece_to_destroy);
    this.generate_barbarian(530, 310, 'AllGameTextures', this.barbarian_group, this.wall_piece_to_destroy);
    this.generate_barbarian(480, 345, 'AllGameTextures', this.barbarian_group, this.wall_piece_to_destroy);
    this.generate_barbarian(433, 381, 'AllGameTextures', this.barbarian_group, this.wall_piece_to_destroy);
    this.generate_barbarian(395, 407, 'AllGameTextures', this.barbarian_group, this.wall_piece_to_destroy);
  },
  generate_barbarian: function(x, y, imageName, groupToAddTo, target_object) {
    newBarbarian = new Barbarian(x, y, imageName);
    if(groupToAddTo) {
      groupToAddTo.add(newBarbarian);
    }
    // console.log("wall: " + this.wall);
    newBarbarian.target_object = target_object;
  },
  generateWallGroup: function(group_to_add_to) {
    //42x29
    var wall_piece = new Wall(572, 275, 'AllGameTextures', 'other');
    group_to_add_to.add(wall_piece);

    wall_piece = new Wall(530, 304, 'AllGameTextures', 'other');
    group_to_add_to.add(wall_piece);

    wall_piece = new Wall(488, 333, 'AllGameTextures', 'other');
    group_to_add_to.add(wall_piece);

    wall_piece = new Wall(446, 362, 'AllGameTextures', 'other');
    group_to_add_to.add(wall_piece);

    wall_piece = new Wall(404, 391, 'AllGameTextures', 'other');
    group_to_add_to.add(wall_piece);

    wall_piece = new Wall(376, 411, 'AllGameTextures', 'first');
    group_to_add_to.add(wall_piece);
  },
  configureDemoAnimation: function() {
    //------------------------------------------------------
    // PLAYER DEMO
    //------------------------------------------------------
    // disappears after one play
    // disables barabarians and cannon from animating
    for(var i = 0; i < this.barbarian_group.children.length; i++) {
      this.barbarian_group.children[i].animations.currentAnim.stop();
    }
    // this.cannon.animations.currentAnim.stop();
    this.performingDemo = true;
    this.player_demo = game.add.sprite(800, 300, 'PlayerDemo');
    this.player_demo.scale.setTo(2, 2);
    this.player_demo.anchor.setTo(0.5, 0.5);
    this.player_demo_frames = Phaser.Animation.generateFrameNames('ghostedChars_', 0, 71, '.png', 5);
    this.player_demo_animation = this.player_demo.animations.add('playerDemo', this.player_demo_frames, 20, false);
    setTimeout((function() {
      this.player_demo.play('playerDemo');
    }).bind(this), 1000);
    this.player_demo_animation.onComplete.add(function() {
      // this.cannon.animations.currentAnim.play();
      this.finishDemoAnimation();
    }, this);
    //------------------------------------------------------
  },
  finishDemoAnimation: function() {
    var demo_alpha_tween = game.add.tween(this.player_demo);
    demo_alpha_tween.to({ alpha: 0 }, 500, Phaser.Easing.Linear.None);
    demo_alpha_tween.onComplete.add(function() { this.player_demo.visible = false; }, this);
    demo_alpha_tween.start();

    this.performingDemo = false;
    for(var i = 0; i < this.barbarian_group.children.length; i++) {
      this.barbarian_group.children[i].animations.currentAnim.play();
    }
  },
  fadeNonTappableAreas: function() {
    var nonTappableTween = game.add.tween(this.untappable_area);
    nonTappableTween.to({ alpha: 0}, 1500, Phaser.Easing.Linear.None);
    nonTappableTween.start();
  },
  configureADCLogoAndInstallButton: function() {
    var isLandscape = window.innerWidth > window.innerHeight;
    //portrait
    if (!isLandscape) {
      if(device_type == 'phone') {
      }
      else {
        this.adcLogo.x = 1150;
        this.gui_install_button.x = 1005;
      }
    }
    //landscape
    else {
      if(device_type == 'phone') {
      }
      else {
        this.adcLogo.x = 1080;
        this.gui_install_button.x = 973;
        // game.state.states.BalloonLevel.gui_install_button.x
      }
    }
  }
};
