function GoblinLevel() {
  //var self = this;

  this.background = null;
  this.last_click = [0,0];
};
GoblinLevel.prototype = {
  preload: function() {
    // console.log("giant level PRELOADING");
  },
  create: function() {
    this.level_change_triggered = false;
    this.fader = new Fader(600, 400);
    this.fader.fadebg.alpha = 1;
    this.fader.startFade(1, 0, 1000);

    window.event_tracking.goblin_level_played++;
    window.event_tracking.current_level = 'GOBLIN_LEVEL';
    CNEventer.send_custom_event('GOBLIN_LEVEL_PLAYED');

    this.list_of_end_positions = [[[385,255],[500,175],[660,300]],
                                  [[385,255],[270,355],[435,480]]];
    this.list_of_gold_bank_positions = [[320,250],[340,230],[360,210],[350,240],[390,210]];
    // this.list_of_gold_bank_positions = list_of_gold_bank_positions;
    // console.log("giant level CREATING");
    this.background = game.add.sprite(0,0, 'grassBackground');
    wooden_fence = game.add.sprite(329, 230, 'woodenFence');
    wooden_fence.anchor.setTo(0.5, 0.5);
    //----------------------------
    this.untappable_gold_bank_area = game.add.sprite(302, 200, 'untappableArea');
    this.untappable_gold_bank_area.anchor.setTo(0.5, 0.5);
    this.untappable_gold_bank_area.scale.setTo(0.4, 0.4);
    this.untappable_gold_bank_rect = new Phaser.Rectangle(this.untappable_gold_bank_area.x, this.untappable_gold_bank_area.y, this.untappable_gold_bank_area.width*.75, this.untappable_gold_bank_area.height*.75);

    this.untappable_cannon_one_area = game.add.sprite(472, 328, 'untappableArea');
    this.untappable_cannon_one_area.anchor.setTo(0.5, 0.5);
    this.untappable_cannon_one_area.scale.setTo(0.25, 0.25);
    this.untappable_cannon_one_rect = new Phaser.Rectangle(this.untappable_cannon_one_area.x, this.untappable_cannon_one_area.y, this.untappable_cannon_one_area.width*0.75, this.untappable_cannon_one_area.height*0.75);

    this.untappable_areas_fade_out_triggered = false;

    //-----------
    // this.untappable_top_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_top_area.scale.setTo(900, 250);
    this.untappable_top_area_rect = new Phaser.Rectangle(0, 0, 900, 200);

    // this.untappable_left_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_left_area.scale.setTo(200,800);
    this.untappable_left_area_rect = new Phaser.Rectangle(0, 0, 200, 800);

    // this.untappable_square_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_square_area.scale.setTo(400,520);
    this.untappable_square_area_rect = new Phaser.Rectangle(0, 0, 400, 520);

    // this.untappable_square_two_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_square_two_area.scale.setTo(640,350);
    this.untappable_square_two_area_rect = new Phaser.Rectangle(0, 0, 640, 350);
    //----------------------------

    cannon_one = new Cannon(472, 318, 'AllGameTextures');
    this.cannon_one = cannon_one;
    this.cannon_one.animations.currentAnim = this.cannon_one.firing_animation;
    this.cannon_one.health = 40;
    this.cannon_one_destroyed_positions_set = false;

    gold_bank = new GoldBank(307, 185, 'AllGameTextures');
    this.gold_bank = gold_bank;
    this.gold_bank.configureHealth(20);

    this.goblin_group = game.add.group();
    this.barbarian_group = game.add.group();
    this.generateLevelBarbarians();
    for(var i = 0; i < this.barbarian_group.length; i++) {
      var attack_animation = Math.floor(Math.random()*2);
      if(attack_animation == 0) {
        // this.barbarian_group.children[i].play('attack_one');
        this.barbarian_group.children[i].animations.currentAnim = this.barbarian_group.children[i].attack_one_animation;
      }
      else {
        // this.barbarian_group.children[i].play('attack_two');
        this.barbarian_group.children[i].animations.currentAnim = this.barbarian_group.children[i].attack_two_animation;
      }
    }

    //-------------
    this.configureDemoAnimation();
    this.played_demo_on_first_view = false;
    this.player_error_text = new ErrorMessage(600, 400, 'errorMessage');
    this.player_error_text.alpha = 0;
    //-------------

    this.gui_current_unit_icon = game.add.sprite(180, 674, 'AllGameTextures');
    //this.gui_current_unit_icon = gui_current_unit_icon;
    this.gui_current_unit_icon.frameName = 'backgrounds/goblin/goblinOverlay.png';
    this.gui_current_unit_icon.anchor.setTo(0.5, 0.5);
    this.gui_current_unit_icon.scale.setTo(0.75, 0.75);

    this.gui_tap_overlay = game.add.sprite(943, 643, 'AllGameTextures');
    // this.gui_tap_overlay = gui_tap_overlay;
    this.gui_tap_overlay.frameName = 'backgrounds/tapOverlay.png';
    this.gui_tap_overlay.anchor.setTo(0.5, 0.5);
    this.gui_tap_overlay.scale.setTo(0.75, 0.75);

    //x, y, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group
    this.gui_install_button = game.add.button(1005, 672, 'AllGameTextures', this.performInstallButtonLogic, this, 'backgrounds/installButton.png', 'backgrounds/installButton.png', 'backgrounds/installButton_down.png', 'backgrounds/installButton.png');
    // this.gui_install_button = gui_install_button;
    this.gui_install_button.anchor.setTo(0.5, 0.5);
    this.gui_install_button.scale.setTo(0.75, 0.75);

    this.gui_unit_tracker = new GUIUnitTracker(175,631,'AllGameTextures');
    // this.gui_unit_tracker = gui_unit_tracker;
    this.gui_unit_tracker.configure(5);

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
    // game.debug.spriteBounds(overlay);
    // game.debug.spriteInfo(playerShip, 32, 32);
    // game.debug.text('Distance Travelled: ' + this.playerShip.distanceTravelledY, 500, 32);
  },
  update: function() {
    // if(typeof(window.music) != 'undefined'
    //    && window.viewable) {
    //   if(!window.music.isPlaying) {
    //     window.music.play();
    //   }
    // }
    if(!this.played_demo_on_first_view) {
      if(window.viewable) {
        this.player_demo.play('playerDemo');
        this.played_demo_on_first_view = true;
      }
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.F)) {
      if(!this.level_change_triggered) {
        this.triggerLevelChange();
      }
    }
    this.performCollisionLogic();
    this.performWorldObjectsTrackingLogic();
  },
  triggerLevelChange: function() {
    if(!this.level_change_triggered) {
      this.level_change_triggered = true;
      this.fader = new Fader(600, 400);
      this.fader.startFade(0, 1, 1000, function() { game.state.start('GiantLevel'); } );
      if(window.viewable) {
        window.sound.level_end.play();
      }
    }
  },
  performWorldObjectsTrackingLogic: function() {
    if(this.cannon_one.health <= 0
       && !this.cannon_one_destroyed_positions_set) {
      this.cannon_one_destroyed_positions_set = true;
      for(var i = 0; i < this.barbarian_group.children.length; i++) {
        if(i == 0) {
          this.barbarian_group.children[i].setTargetPosition([[333,265]]);
        }
        else if(i == 1) {
          this.barbarian_group.children[i].setTargetPosition([[400,215]]);
        }
        else if(i == 2) {
          this.barbarian_group.children[i].setTargetPosition([[385,242]]);
        }
        else if(i == 3) {
          this.barbarian_group.children[i].setTargetPosition([[362,252]]);
        }
        else {
          this.barbarian_group.children[i].setTargetPosition([[365,225]]);
        }
        this.barbarian_group.children[i].target_object = this.gold_bank;
      }
    }
    if(this.gold_bank.health <= 0) {
      setTimeout((function() {
        this.triggerLevelChange();
      }).bind(this), 1000);
    }
  },
  performTouchLogic: function() {
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
   //-------------------------
    var untappable_gold_bank_rect_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_gold_bank_rect.x - this.untappable_gold_bank_rect.width/2))
     && (game.input.activePointer.x < (this.untappable_gold_bank_rect.x + this.untappable_gold_bank_rect.width/2))
     && (game.input.activePointer.y > (this.untappable_gold_bank_rect.y - this.untappable_gold_bank_rect.height/2))
     && (game.input.activePointer.y < (this.untappable_gold_bank_rect.y + this.untappable_gold_bank_rect.height/2))) {
      untappable_gold_bank_rect_contains_pointer = true;
    }
    var untappable_cannon_one_rect_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_cannon_one_rect.x - this.untappable_cannon_one_rect.width/2))
     && (game.input.activePointer.x < (this.untappable_cannon_one_rect.x + this.untappable_cannon_one_rect.width/2))
     && (game.input.activePointer.y > (this.untappable_cannon_one_rect.y - this.untappable_cannon_one_rect.height/2))
     && (game.input.activePointer.y < (this.untappable_cannon_one_rect.y + this.untappable_cannon_one_rect.height/2))) {
      untappable_cannon_one_rect_contains_pointer = true;
    }
    //-------------------------
    var untappable_squares_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_top_area_rect.x))
     && (game.input.activePointer.x < (this.untappable_top_area_rect.width))
     && (game.input.activePointer.y > (this.untappable_top_area_rect.y))
     && (game.input.activePointer.y < (this.untappable_top_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    if((game.input.activePointer.x > (this.untappable_left_area_rect.x)) && (game.input.activePointer.x < (this.untappable_left_area_rect.width)) && (game.input.activePointer.y > (this.untappable_left_area_rect.y))
     && (game.input.activePointer.y < (this.untappable_left_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    if((game.input.activePointer.x > (this.untappable_square_area_rect.x)) && (game.input.activePointer.x < (this.untappable_square_area_rect.width)) && (game.input.activePointer.y > (this.untappable_square_area_rect.y))
     && (game.input.activePointer.y < (this.untappable_square_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    if((game.input.activePointer.x > (this.untappable_square_two_area_rect.x)) && (game.input.activePointer.x < (this.untappable_square_two_area_rect.width)) && (game.input.activePointer.y > (this.untappable_square_two_area_rect.y))
     && (game.input.activePointer.y < (this.untappable_square_two_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    // this.untappable_square_two_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_square_two_area.scale.setTo(600,400);
    // this.untappable_square_two_area_rect = new Phaser.Rectangle(0, 0, 400, 520);
    //-------------------------
    this.untappable_top_area_rect = new Phaser.Rectangle(0, 0, 900, 200);
    if(!button_contains_pointer
       && !current_unit_icon_contains_pointer
       && !untappable_gold_bank_rect_contains_pointer
       && !untappable_cannon_one_rect_contains_pointer
       && !untappable_squares_contains_pointer
       && this.fader.fade_finished
       && this.gui_unit_tracker.units_available_to_deploy > 0) {

      window.event_tracking.goblins_summoned++;
      CNEventer.send_custom_event('GOBLIN_SUMMONED');

      this.gui_unit_tracker.lowerUnitCount();
      new_goblin = new Goblin(game.input.activePointer.x, game.input.activePointer.y, 'AllGameTextures');

      var selected_path = 0;
      var path_one_difference_x = this.list_of_end_positions[0][2][0] - new_goblin.x;
      var path_one_difference_y = this.list_of_end_positions[0][2][1] - new_goblin.y;
      var path_two_difference_x = this.list_of_end_positions[1][2][0] - new_goblin.x;
      var path_two_difference_y = this.list_of_end_positions[1][2][1] - new_goblin.y;

      var path_one_distance = Math.sqrt(Math.pow(path_one_difference_x, 2) + Math.pow(path_one_difference_y, 2));
      var path_two_distance = Math.sqrt(Math.pow(path_two_difference_x, 2) + Math.pow(path_two_difference_y, 2));
      if(path_one_distance < path_two_distance) {
        selected_path = 0;
      }
      else {
        selected_path = 1;
      }
      // var selected_pathing = this.list_of_end_positions[selected_path].slice();
      var selected_pathing = this.list_of_end_positions[selected_path].map(function(array_to_map) { return array_to_map.slice(); });

      var random_gold_bank_position = this.list_of_gold_bank_positions.splice(Math.floor(Math.random()* this.list_of_gold_bank_positions.length), 1);

      //fixes final x
      selected_pathing[0][0] = random_gold_bank_position[0][0];
      //fixes final y
      selected_pathing[0][1] = random_gold_bank_position[0][1];

      new_goblin.setTargetPosition(selected_pathing);
      new_goblin.target_object = this.gold_bank;
      this.goblin_group.add(new_goblin);

      if(!this.untappable_areas_fade_out_triggered) {
        this.untappable_areas_fade_out_triggered = true;
        this.fadeNonTappableAreas();
      }
    }
    if((untappable_gold_bank_rect_contains_pointer
       || untappable_cannon_one_rect_contains_pointer)
       && this.gui_unit_tracker.units_available_to_deploy > 0) {
      this.player_error_text.fadeInThenOut(500);
    }
    if(this.performingDemo) {
      this.finishDemoAnimation();
    }
  },
  performInstallButtonLogic: performInstallButtonLogic,
  performCollisionLogic: function() {
    //----------------------
    //collision logic
    //----------------------
    for(var i = 0; i < this.barbarian_group.length; i++) {
      this.cannon_one.checkForSingleSpriteCollisionWithCannonballs(this.barbarian_group.children[i]);
    }
    //----------------------
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
    // setTimeout((function() {
    //   this.player_demo.play('playerDemo');
    // }).bind(this), 1000);
    this.player_demo_animation.onComplete.add(function() {
      // this.cannon.animations.currentAnim.play();
      this.finishDemoAnimation();
      this.performingDemo = false;
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
    this.cannon_one.animations.currentAnim.play();
  },
  fadeNonTappableAreas: function() {
    var non_tappable_gold_bank_tween = game.add.tween(this.untappable_gold_bank_area);
    non_tappable_gold_bank_tween.to({ alpha: 0}, 1500, Phaser.Easing.Linear.None);
    non_tappable_gold_bank_tween.start();

    var non_tappable_cannon_one_tween = game.add.tween(this.untappable_cannon_one_area);
    non_tappable_cannon_one_tween.to({ alpha: 0}, 1500, Phaser.Easing.Linear.None);
    non_tappable_cannon_one_tween.start();
  },
  generateLevelBarbarians: function() {
    this.generate_barbarian(465, 390, 'AllGameTextures', this.barbarian_group, this.cannon_one);
    this.generate_barbarian(535, 345, 'AllGameTextures', this.barbarian_group, this.cannon_one);
    this.generate_barbarian(520, 360, 'AllGameTextures', this.barbarian_group, this.cannon_one);
    this.generate_barbarian(490, 380, 'AllGameTextures', this.barbarian_group, this.cannon_one);
  },
  generate_barbarian: function(x, y, imageName, groupToAddTo, target_object) {
    new_barbarian = new Barbarian(x, y, imageName);
    if(groupToAddTo) {
      groupToAddTo.add(new_barbarian);
    }
    if(target_object) {
      new_barbarian.target_object = target_object;
    }
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
