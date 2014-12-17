var isAndroid = typeof adc_bridge != 'undefined' && adc_bridge.os_name == 'android';
var isiOS = !isAndroid;
var device_type = 'none';
if(typeof(ADC_DEVICE_INFO) != 'undefined') {
  device_type = ADC_DEVICE_INFO.device_type;
}
var hardcoded_x_aspect = 1200;
var hardcoded_y_aspect = 800;

var event_tracking = {
  current_level: '',
  balloons_summoned: 0,
  giants_summoned: 0,
  goblins_summoned: 0,
  balloon_level_played: 0,
  giant_level_played: 0,
  goblin_level_played: 0
}

var performInstallButtonLogic = function() {
  CNEventer.send_adc_event('DOWNLOAD');
  CNEventer.send_custom_event(
    "INSTALL_BUTTON_CLICKED_ON_" + window.event_tracking.current_level + ": \n" +
    "GOBLINS_SUMMONED: " + window.event_tracking.goblins_summoned + "\n" +
    " GIANTS_SUMMONED: " + window.event_tracking.giants_summoned + "\n" +
    " BALLOONS_SUMMONED: " + window.event_tracking.balloons_summoned + "\n" +
    " GOBLIN_LEVEL_PLAYED: " + window.event_tracking.goblin_level_played + "\n" +
    " GIANT_LEVEL_PLAYED: " + window.event_tracking.giant_level_played + "\n" +
    " BALLOON_LEVEL_PLAYED: " + window.event_tracking.balloon_level_played
    );
  if(typeof(mraid) != 'undefined') {
    if(isiOS) {
      var app_store_url = 'https://itunes.apple.com/us/app/clash-of-clans/id529479190?mt=8';
      app_store_url = app_store_url.replace(/https?/, 'safari');
      mraid.openStore(app_store_url);
    }
    else {
      var app_store_url = 'https://play.google.com/store/apps/details?id=com.supercell.clashofclans';
      app_store_url = app_store_url.replace(/https?/, 'browser');
      mraid.openStore(app_store_url);
    }
  }
  else {
    window.location = 'https://itunes.apple.com/us/app/clash-of-clans/id529479190?mt=8';
  }
};
//this helps the transition when the player presses the replay button
if(typeof(mraid) != 'undefined') {
  window.viewable = false;
}
else {
  window.viewable = true;
}
function configureViewableChangeReset() {
  // alert('setting viewable change');
  if(typeof(mraid) != 'undefined') {
    mraid.addEventListener('viewableChange', function (isViewable) {
      window.viewable = isViewable;
      // alert('viewable change!');
      if (isViewable) {
        game.paused = false;
      }
      else {
        // if(game.load.hasLoaded) {
        if(game.state.current != 'Preloader') {
          game.sound.stopAll();
          game.state.start('GoblinLevel');
        }
        // }
      }
    });
  }
}
configureViewableChangeReset();

function resizeGame() {
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  if(typeof(ADC_DEVICE_INFO) != 'undefined'
     && ADC_DEVICE_INFO.device_type == 'phone') {
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.setExactFit();
    game.scale.refresh();
  }
  else {
    var scale_factor = 1;
    var isLandscape = window.innerWidth > window.innerHeight;
    // portrait
    if (!isLandscape) {
      scale_factor = window.innerWidth/hardcoded_x_aspect;
    }
    //landscape
    else {
      scale_factor = window.innerHeight/hardcoded_y_aspect;
    }
    game.scale.height = hardcoded_y_aspect*scale_factor;
    game.scale.width = hardcoded_x_aspect*scale_factor;
    game.scale.refresh();

    if(game.scale.width > window.innerWidth) {
      game.canvas.style.marginLeft = '-'+(parseFloat(game.scale.width - window.innerWidth)/2)+'px';
    }
    //---------------------------------------------------------------------------
    // Fixes the button and adcolony logo
    if(game.state.current == 'Preloader') {
      game.state.states.Preloader.configureADCLogoAndInstallButton();
    }
    else if(game.state.current == 'GoblinLevel') {
      game.state.states.GoblinLevel.configureADCLogoAndInstallButton();
    }
    else if(game.state.current == 'GiantLevel') {
      game.state.states.GiantLevel.configureADCLogoAndInstallButton();
    }
    else if(game.state.current == 'BalloonLevel') {
      game.state.states.BalloonLevel.configureADCLogoAndInstallButton();
    }
    //---------------------------------------------------------------------------
    console.log("resized");
  }
}

window.addEventListener('orientationchange', function() {
  resizeGame();
  // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  // SHOW_ALL
  // var isLandscape = window.innerWidth > window.innerHeight;
  //portrait
  // if (!isLandscape) {
    // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // alert('changed to portrait');
  // }
  //landscape
  // else {
    // alert('changed to portrait');
    // game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  // }
});
//-----------------------------------------------------------------------------
Boot = function (game) {
};

Boot.prototype = {
    preload: function () {
        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'images/preloader/loadingScreen.jpg');
        // this.load.image('preloaderBackground', 'images/backgrounds/loadingScreenRef.jpg');

        this.load.image('preloaderBar','images/preloader/loadingBarOnly.png');
        this.load.image('preloaderBarEmpty','images/preloader/loadingBarEmpty.png');
        this.load.image('loadingText','images/preloader/loadingCopy.png');
        this.load.image('installOverlay','images/preloader/installOverlay.png');
        // this.load.spritesheet('installButton','images/preloader/installButton_sprite.png', 361, 128);
        this.load.spritesheet('installButton','images/preloader/installButton_sprite.png', 361, 132);

        this.load.image('adcLogo', 'images/backgrounds/adcolony_blk.png');
        this.load.image('adcLogoWhite', 'images/backgrounds/adcolony_white.png');
        this.load.audio('loadingScreenStartup', ['audio/loadingScreenStartup.wav']);

        window.sound = window.sound || {};
        window.sound.loading_screen_startup = game.add.audio('loadingScreenStartup');
    },
    create: function () {
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        // this.stage.disableVisibilityChange = true;

        // this.scale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = true;
        // this.scale.forceLandscape = true;
        // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        // this.scale.height = window.innerHeight;
        // this.scale.width = window.innerWidth;
        // this.scale.refresh();
        resizeGame();
        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            // this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

            // this.scale.minWidth = 480;
            // this.scale.minHeight = 260;
            // this.scale.maxWidth = 1024;
            // this.scale.maxHeight = 768;
            // this.scale.forceLandscape = true;
            // this.scale.pageAlignHorizontally = true;
            // this.scale.pageAlignVertically = true;
            // console.log(this.scale.pageAlignVertically);
            // this.scale.setScreenSize(true);
        }

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');
    }
};
