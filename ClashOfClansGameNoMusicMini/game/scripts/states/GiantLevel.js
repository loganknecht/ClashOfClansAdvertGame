function GiantLevel() {
  //var self = this;

  this.background = null;
  this.last_click = [0,0];
  this.gold_bank_position = [440,270];
};
GiantLevel.prototype = {
  preload: function() {
    // console.log("giant level PRELOADING");
  },
  create: function() {
    window.event_tracking.giant_level_played++;
    window.event_tracking.current_level = 'GIANT_LEVEL';
    CNEventer.send_custom_event('GIANT_LEVEL_PLAYED');

    list_of_end_positions = {cannon_one: [400,400],
                             cannon_two: [635,230] };
    this.list_of_end_positions = list_of_end_positions;

    // console.log("giant level CREATING");
    this.background = game.add.sprite(0,0, 'grassBackground');

    this.pine1 = game.add.sprite(101, 243, 'bigPine');
    this.pine1.anchor.setTo(0.5, 0.5);

    this.pine2 = game.add.sprite(1059, 69, 'bigPine');
    this.pine2.anchor.setTo(0.5, 0.5);

    half_tree = game.add.sprite(414, 44, 'halfTree');
    half_tree.anchor.setTo(0.5, 0.5);

    //----------------------------
    this.untappable_gold_bank_area = game.add.sprite(375, 195, 'untappableArea');
    this.untappable_gold_bank_area.anchor.setTo(0.5, 0.5);
    this.untappable_gold_bank_area.scale.setTo(0.4, 0.4);
    this.untappable_gold_bank_rect = new Phaser.Rectangle(this.untappable_gold_bank_area.x, this.untappable_gold_bank_area.y, this.untappable_gold_bank_area.width*.75, this.untappable_gold_bank_area.height*.75);

    this.untappable_cannon_one_area = game.add.sprite(315, 405, 'untappableArea');
    this.untappable_cannon_one_area.anchor.setTo(0.5, 0.5);
    this.untappable_cannon_one_area.scale.setTo(0.25, 0.25);
    this.untappable_cannon_one_rect = new Phaser.Rectangle(this.untappable_cannon_one_area.x, this.untappable_cannon_one_area.y, this.untappable_cannon_one_area.width*0.75, this.untappable_cannon_one_area.height*0.75);

    this.untappable_cannon_two_area = game.add.sprite(605, 185, 'untappableArea');
    this.untappable_cannon_two_area.anchor.setTo(0.5, 0.5);
    this.untappable_cannon_two_area.scale.setTo(0.25, 0.25);
    this.untappable_cannon_two_rect = new Phaser.Rectangle(this.untappable_cannon_two_area.x, this.untappable_cannon_two_area.y, this.untappable_cannon_two_area.width*0.75, this.untappable_cannon_two_area.height*0.75);

    this.untappable_areas_fade_out_triggered = false;
    //-----------
    // this.untappable_top_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_top_area.scale.setTo( 800, 200);
    this.untappable_top_area_rect = new Phaser.Rectangle(0, 0, 800, 200);

    // this.untappable_left_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_left_area.scale.setTo(300,600);
    this.untappable_left_area_rect = new Phaser.Rectangle(0, 0, 300, 600);

    // this.untappable_square_area = game.add.sprite(0, 0, 'whitePixel');
    // this.untappable_square_area.scale.setTo(400,520);
    // this.untappable_square_area_rect = new Phaser.Rectangle(0, 0, 400, 520);
    //----------------------------

    this.gold_bank = new GoldBank(380, 180, 'AllGameTextures');
    this.gold_bank.configureHealth(30);

    cannon_one = new Cannon(315, 395, 'AllGameTextures');
    this.cannon_one = cannon_one;
    this.cannon_one.play('firing');
    this.cannon_one.health = 10;
    cannon_two = new Cannon(603, 175, 'AllGameTextures');
    this.cannon_two = cannon_two;
    this.cannon_two.play('firing');
    this.cannon_two.health = 10;

    this.goblin_group = game.add.group();
    this.generateLevelGoblins(this.goblin_group);

    this.cannon_one_barbarian_group = game.add.group();
    this.generateCannonOneBarbarians(this.cannon_one_barbarian_group);
    this.cannon_one_destroyed_positions_set = false;
    for(var i = 0; i < this.cannon_one_barbarian_group.length; i++) {
      var attack_animation = Math.floor(Math.random()*2);
      if(attack_animation == 0) {
        this.cannon_one_barbarian_group.children[i].play('attack_one');
      }
      else {
        this.cannon_one_barbarian_group.children[i].play('attack_two');
      }
    }

    this.cannon_two_barbarian_group = game.add.group();
    this.generateCannonTwoBarbarians(this.cannon_two_barbarian_group);
    this.cannon_two_destroyed_positions_set = false;
    for(var i = 0; i < this.cannon_two_barbarian_group.length; i++) {
      var attack_animation = Math.floor(Math.random()*2);
      if(attack_animation == 0) {
        this.cannon_two_barbarian_group.children[i].play('attack_one');
      }
      else {
        this.cannon_two_barbarian_group.children[i].play('attack_two');
      }
    }

    giant_group = game.add.group();
    this.giant_group = giant_group;

    //-------------
    this.player_error_text = new ErrorMessage(600, 400, 'errorMessage');
    this.player_error_text.alpha = 0;
    //-------------

    this.gui_current_unit_icon = game.add.sprite(180, 674, 'AllGameTextures');
    this.gui_current_unit_icon.frameName = 'backgrounds/giant/giantOverlay.png';
    this.gui_current_unit_icon.anchor.setTo(0.5, 0.5);
    this.gui_current_unit_icon.scale.setTo(0.75, 0.75);

    this.gui_tap_overlay = game.add.sprite(943, 643, 'AllGameTextures');
    this.gui_tap_overlay.frameName = 'backgrounds/tapOverlay.png';
    this.gui_tap_overlay.anchor.setTo(0.5, 0.5);
    this.gui_tap_overlay.scale.setTo(0.75, 0.75);

    //x, y, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group
    this.gui_install_button = game.add.button(1005, 672, 'AllGameTextures', this.performInstallButtonLogic, this, 'backgrounds/installButton.png', 'backgrounds/installButton.png', 'backgrounds/installButton_down.png', 'backgrounds/installButton.png');
    this.gui_install_button.anchor.setTo(0.5, 0.5);
    this.gui_install_button.scale.setTo(0.75, 0.75);

    this.gui_unit_tracker = new GUIUnitTracker(175,631,'AllGameTextures');
    this.gui_unit_tracker.configure(2);

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
      this.fader.startFade(0, 1, 1000, function() { game.state.start('BalloonLevel'); } );
      if(window.viewable) {
        window.sound.level_end.play();
      }
    }
  },
  performWorldObjectsTrackingLogic: function() {
    //wall one
    if(this.cannon_one.health <= 0
       && !this.cannon_one_destroyed_positions_set) {
      this.cannon_one_destroyed_positions_set = true;
      //-----------------
      for(var i = 0; i < this.cannon_one_barbarian_group.children.length; i++) {
        if(this.cannon_two.health > 0) {
          console.log('setting barbarians to attack cannon two');
          // selected_position = this.list_of_end_positions['cannon_one'];
          // new_giant.target_object = this.cannon_one;
          this.cannon_one_barbarian_group.children[i].setTargetPosition([this.list_of_end_positions['cannon_two']]);
          this.cannon_one_barbarian_group.children[i].target_object = this.cannon_two;
        }
        else {
          console.log('setting barbarians to attack gold bank');
          this.cannon_one_barbarian_group.children[i].setTargetPosition([[440,270]]);
          this.cannon_one_barbarian_group.children[i].target_object = this.gold_bank;
        }
      }
      //-----------------
      for(var i = 0; i < this.cannon_two_barbarian_group.children.length; i++) {
        if(this.cannon_two_barbarian_group.children[i].target_object != this.cannon_two) {
          if(this.cannon_two.health > 0) {
            console.log('setting barbarians to attack cannon two');
            // selected_position = this.list_of_end_positions['cannon_one'];
            // new_giant.target_object = this.cannon_one;
            this.cannon_two_barbarian_group.children[i].setTargetPosition([this.list_of_end_positions['cannon_two']]);
            this.cannon_two_barbarian_group.children[i].target_object = this.cannon_two;
          }
          else {
            console.log('setting barbarians to attack gold bank');
            this.cannon_two_barbarian_group.children[i].setTargetPosition([[440,270]]);
            this.cannon_two_barbarian_group.children[i].target_object = this.gold_bank;
          }
        }
      }
      //-----------------
      for(var i = 0; i < this.giant_group.children.length; i++) {
        // console.log("cannon one iterating over giants!");
        if(this.cannon_two.health > 0) {
          console.log('setting giants to attack cannon two');
          this.giant_group.children[i].setTargetPosition([this.list_of_end_positions['cannon_two']]);
          this.giant_group.children[i].target_object = this.cannon_two;
        }
        else {
          console.log('setting giants to attack gold bank');
          // console.log("giant targetting cannon destroy");
          this.giant_group.children[i].setTargetPosition([[440,270]]);
          this.giant_group.children[i].target_object = this.gold_bank;
        }
      }
    }

    if(this.cannon_two.health <= 0
       && !this.cannon_two_destroyed_positions_set) {
      this.cannon_two_destroyed_positions_set = true;
      //-----------------
      for(var i = 0; i < this.cannon_two_barbarian_group.children.length; i++) {
        if(this.cannon_one.health > 0) {
          this.cannon_two_barbarian_group.children[i].setTargetPosition([this.list_of_end_positions['cannon_one']]);
          this.cannon_two_barbarian_group.children[i].target_object = this.cannon_one;
        }
        else {
          this.cannon_two_barbarian_group.children[i].setTargetPosition([[440,270]]);
          this.cannon_two_barbarian_group.children[i].target_object = this.gold_bank;
        }
      }
      //-----------------
      for(var i = 0; i < this.cannon_one_barbarian_group.children.length; i++) {
        if(this.cannon_one_barbarian_group.children[i].target_object != this.cannon_one) {
          if(this.cannon_one.health > 0) {
            console.log('setting barbarians to attack cannon two');
            // selected_position = this.list_of_end_positions['cannon_one'];
            // new_giant.target_object = this.cannon_one;
            this.cannon_one_barbarian_group.children[i].setTargetPosition([this.list_of_end_positions['cannon_one']]);
            this.cannon_one_barbarian_group.children[i].target_object = this.cannon_one;
          }
          else {
            console.log('setting barbarians to attack gold bank');
            this.cannon_one_barbarian_group.children[i].setTargetPosition([[440,270]]);
            this.cannon_one_barbarian_group.children[i].target_object = this.gold_bank;
          }
        }
      }
      //-----------------
      // console.log("giants!");
      for(var i = 0; i < this.giant_group.children.length; i++) {
        // console.log("cannon two iterating over giants");

        if(this.cannon_one.health > 0) {
          this.giant_group.children[i].setTargetPosition([this.list_of_end_positions['cannon_one']]);
          this.giant_group.children[i].target_object = this.cannon_one;
        }
        else {
          this.giant_group.children[i].setTargetPosition([[440,270]]);
          this.giant_group.children[i].target_object = this.gold_bank;
        }
      }
    }

    // if(this.gold_bank.health <= 0
    if(this.cannon_one.health <= 0
       && this.cannon_two.health <= 0) {
      this.triggerLevelChange();
    }
  },
  performTouchLogic: function() {
    var button_contains_pointer = false;
    if((game.input.activePointer.x > (this.gui_install_button.position.x - this.gui_install_button.width/2))
       && (game.input.activePointer.x < (this.gui_install_button.position.x + this.gui_install_button.width/2))
       && (game.input.activePointer.y > (this.gui_install_button.position.y - this.gui_install_button.height/2))
       && (game.input.activePointer.y < (this.gui_install_button.position.y + this.gui_install_button.height/2))) {
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
    var untappable_cannon_two_rect_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_cannon_two_rect.x - this.untappable_cannon_two_rect.width/2))
     && (game.input.activePointer.x < (this.untappable_cannon_two_rect.x + this.untappable_cannon_two_rect.width/2))
     && (game.input.activePointer.y > (this.untappable_cannon_two_rect.y - this.untappable_cannon_two_rect.height/2))
     && (game.input.activePointer.y < (this.untappable_cannon_two_rect.y + this.untappable_cannon_two_rect.height/2))) {
      untappable_cannon_two_rect_contains_pointer = true;
    }
    //-------------------------
    var untappable_squares_contains_pointer = false;
    if((game.input.activePointer.x > (this.untappable_top_area_rect.x))
     && (game.input.activePointer.x < (this.untappable_top_area_rect.width))
     && (game.input.activePointer.y > (this.untappable_top_area_rect.y))
     && (game.input.activePointer.y < (this.untappable_top_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    if((game.input.activePointer.x > (this.untappable_left_area_rect.x))
      && (game.input.activePointer.x < (this.untappable_left_area_rect.width))
       && (game.input.activePointer.y > (this.untappable_left_area_rect.y))
       && (game.input.activePointer.y < (this.untappable_left_area_rect.height))) {
      untappable_squares_contains_pointer = true;
    }
    //-------------------------
    if(!button_contains_pointer
       && !current_unit_icon_contains_pointer
       && !untappable_gold_bank_rect_contains_pointer
       && !untappable_cannon_one_rect_contains_pointer
       && !untappable_cannon_two_rect_contains_pointer
       && !untappable_squares_contains_pointer
       && this.fader.fade_finished
       && this.gui_unit_tracker.units_available_to_deploy > 0) {
       // && this.list_of_end_positions.length > 0) {

      window.event_tracking.giants_summoned++;
      CNEventer.send_custom_event('GIANT_SUMMONED');

      this.gui_unit_tracker.lowerUnitCount();
      new_giant = new Giant(game.input.activePointer.x, game.input.activePointer.y, 'AllGameTextures');

      //target either or
      if(this.cannon_one.health > 0 && this.cannon_two.health > 0) {
        var selected_cannon = 0;
        var cannon_one_difference_x = this.cannon_one.x - new_giant.x;
        var cannon_one_difference_y = this.cannon_one.y - new_giant.y;
        var cannon_two_difference_x = this.cannon_two.x - new_giant.x;
        var cannon_two_difference_y = this.cannon_two.y - new_giant.y;
        var cannon_one_distance = Math.sqrt(Math.pow(cannon_one_difference_x, 2) + Math.pow(cannon_one_difference_y, 2));
        var cannon_two_distance = Math.sqrt(Math.pow(cannon_two_difference_x, 2) + Math.pow(cannon_two_difference_y, 2));
        if(cannon_one_distance < cannon_two_distance) {
          selected_cannon = 0;
        }
        else {
          selected_cannon = 1;
        }
        // var selected_cannon = Math.floor(Math.random()*2);
        var selected_position = [];
        if(selected_cannon == 0) {
          selected_position = this.list_of_end_positions['cannon_one'];
          new_giant.target_object = this.cannon_one;
          // console.log("created giant going to cannon one");
        }
        else if(selected_cannon == 1) {
          selected_position = this.list_of_end_positions['cannon_two'];
          new_giant.target_object = this.cannon_two;
          // console.log("created giant going to cannon two");
        }
        new_giant.setTargetPosition([selected_position]);
      }
      //target cannon one
      else if(this.cannon_one.health > 0) {
        var selected_position = [];
        selected_position = this.list_of_end_positions['cannon_one'];
        new_giant.setTargetPosition([selected_position]);
        new_giant.target_object = this.cannon_one;
        // console.log("created giant going to cannon one");
      }
      //target cannon two
      else if(this.cannon_two.health > 0) {
        var selected_position = [];
        selected_position = this.list_of_end_positions['cannon_two'];
        new_giant.setTargetPosition([selected_position]);
        new_giant.target_object = this.cannon_two;
        // console.log("created giant going to cannon two");
      }
      //go for gold bank
      else {
        new_giant.setTargetPosition([[this.gold_bank_position[0], this.gold_bank_position[1]]]);
        new_giant.target_object = this.gold_bank;
      }

      this.giant_group.add(new_giant);
    }

    if((untappable_gold_bank_rect_contains_pointer
       || untappable_cannon_one_rect_contains_pointer
       || untappable_cannon_two_rect_contains_pointer)
       && this.gui_unit_tracker.units_available_to_deploy > 0) {
      this.player_error_text.fadeInThenOut(500);
    }

    if(!this.untappable_areas_fade_out_triggered) {
      this.untappable_areas_fade_out_triggered = true;
      this.fadeNonTappableAreas();
    }
  },
  performInstallButtonLogic: performInstallButtonLogic,
  performCollisionLogic: function() {
    //----------------------
    //collision logic
    //----------------------
    for(var i = 0; i < this.cannon_one_barbarian_group.length; i++) {
      this.cannon_one.checkForSingleSpriteCollisionWithCannonballs(this.cannon_one_barbarian_group.children[i]);
    }
    for(var i = 0; i < this.cannon_two_barbarian_group.length; i++) {
      this.cannon_two.checkForSingleSpriteCollisionWithCannonballs(this.cannon_two_barbarian_group.children[i]);
    }
    for(var i = 0; i < this.cannon_two_barbarian_group.length; i++) {
      this.cannon_one.checkForSingleSpriteCollisionWithCannonballs(this.giant_group.children[i]);
      this.cannon_two.checkForSingleSpriteCollisionWithCannonballs(this.giant_group.children[i]);
    }
    //----------------------
  },
  fadeNonTappableAreas: function() {
    var non_tappable_gold_bank_tween = game.add.tween(this.untappable_gold_bank_area);
    non_tappable_gold_bank_tween.to({ alpha: 0}, 1500, Phaser.Easing.Linear.None);
    non_tappable_gold_bank_tween.start();

    var non_tappable_cannon_one_tween = game.add.tween(this.untappable_cannon_one_area);
    non_tappable_cannon_one_tween.to({ alpha: 0}, 1500, Phaser.Easing.Linear.None);
    non_tappable_cannon_one_tween.start();

    var non_tappable_cannon_two_tween = game.add.tween(this.untappable_cannon_two_area);
    non_tappable_cannon_two_tween.to({ alpha: 0}, 1500, Phaser.Easing.Linear.None);
    non_tappable_cannon_two_tween.start();
  },
  generateCannonOneBarbarians: function(group_to_add_barbarians_to) {
    this.generateBarbarian(325, 460, 'AllGameTextures', group_to_add_barbarians_to, this.cannon_one);
    this.generateBarbarian(365, 435, 'AllGameTextures', group_to_add_barbarians_to, this.cannon_one);
    // this.generateBarbarian(705, 355, 'AllGameTextures', this.barbarian_group);
  },
  generateCannonTwoBarbarians: function(group_to_add_barbarians_to) {
    this.generateBarbarian(615, 245, 'AllGameTextures', group_to_add_barbarians_to, this.cannon_two);
    this.generateBarbarian(665, 215, 'AllGameTextures', group_to_add_barbarians_to, this.cannon_two);
  },
  generateBarbarian: function(x, y, imageName, group_to_add_to, target_object) {
    var newBarbarian = new Barbarian(x, y, imageName);
    if(group_to_add_to) {
      group_to_add_to.add(newBarbarian);
    }
    if(target_object) {
      newBarbarian.target_object = target_object;
    }
  },
  generateLevelGoblins: function(group_to_add_to) {
    // 475,270
    this.generateGoblin(465, 225, 'AllGameTextures', group_to_add_to, this.gold_bank);
    this.generateGoblin(450, 245, 'AllGameTextures', group_to_add_to, this.gold_bank);
    this.generateGoblin(420, 255, 'AllGameTextures', group_to_add_to, this.gold_bank);
  },
  generateGoblin: function(x, y, imageName, group_to_add_to, target_object) {
    var new_goblin = new Goblin(x, y, imageName);
    if(group_to_add_to) {
      group_to_add_to.add(new_goblin);
    }
    if(typeof(target_object) != 'undefined') {
      new_goblin.target_object = target_object;
      new_goblin.current_state = 'attacking';
      // console.log("set target object");
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
