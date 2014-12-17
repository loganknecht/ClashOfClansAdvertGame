
Preloader = function (game) {
  this.background = null;
  this.preloadBar = null;

  this.ready = false;
  this.load_sound_played = false;
};

Preloader.prototype = {
  loadUpdate: function() {
    if(!this.load_sound_played) {
      if(window.sound.loading_screen_startup.isPlaying) {
        this.load_sound_played = true;
      }
      else {
        if(window.viewable) {
          window.sound.loading_screen_startup.play();
        }
      }
    }
  },
  preload: function () {
    //  These are the assets we loaded in Boot.js
    //  A nice sparkly background and a loading progress bar
    this.background = this.add.sprite(0, 0, 'preloaderBackground');
    this.preloadBarBackground = this.add.sprite(320, 100, 'preloaderBarEmpty');
    this.preloadBar = this.add.sprite(320, 100, 'preloaderBar');
    this.loadingText = this.add.sprite(485, 73, 'loadingText');

    gui_tap_overlay = game.add.sprite(907, 678, 'installOverlay');
    this.gui_tap_overlay = gui_tap_overlay;
    this.gui_tap_overlay.anchor.setTo(0.5, 0.5);

    gui_install_button = game.add.button(920, 676, 'installButton', performInstallButtonLogic, this, 2, 1,  0);
    this.gui_install_button = gui_install_button;
    this.gui_install_button.anchor.setTo(0.5, 0.5);
    this.gui_install_button.setFrames(0, 0, 1, 0);

    if(device_type == 'phone') {
      this.adcLogo = game.add.sprite(1105, 775, 'adcLogoWhite');
      this.adcLogo.anchor.setTo(0.5, 0.5);
    }
    else {
      this.adcLogo = game.add.sprite(1150, 785, 'adcLogoWhite');
      this.adcLogo.anchor.setTo(0.5, 0.5);
      this.adcLogo.scale.setTo(0.5, 0.5);
    }
    this.configureADCLogoAndInstallButton();

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);
    // window.sound.loading_screen_startup.autoplay = true;
    // window.sound.loading_screen_startup.pause();
    // window.sound.loading_screen_startup.play();

    //  Here we load the rest of the assets our game needs.
    //  As this is just a Project Template I've not provided these assets, swap them for your own.
    this.load.image('whitePixel', 'images/white_pixel_1x1.png');
    this.load.image('grassBackground', 'images/backgrounds/grass.jpg');

    this.load.image('bigPine', 'images/backgrounds/bigPiner.png');
    this.load.image('halfTree', 'images/backgrounds/roundTree.png');
    this.load.image('balloonFence', 'images/backgrounds/balloonLevelFence.png');
    this.load.image('stoneWall', 'images/backgrounds/stoneWall.png');
    this.load.image('woodenFence', 'images/backgrounds/fence.png');

    this.load.image('errorMessage', 'images/backgrounds/errorMsg.png');
    this.load.image('untappableArea', 'images/backgrounds/untappable.png');
    this.load.image('untappableThin', 'images/backgrounds/untappableThin.png');
    this.load.image('adcLogo', 'images/backgrounds/adcolony_blk.png');
    this.load.image('adcLogoWhite', 'images/backgrounds/adcolony_white.png');

    this.load.atlas('AllGameTextures', 'images/atlasses/TestAtlas5.png', 'images/atlasses/TestAtlas5.json');
    this.load.atlas('PlayerDemo', 'images/atlasses/GhostedCharacter.png', 'images/atlasses/GhostedCharacter.json');

    this.load.audio('music', ['audio/combatMusic.wav']);
    this.load.audio('balloon_hit', ['audio/ballonHit.wav']);
    this.load.audio('barbarian_hit', ['audio/barbarianHit.wav']);
    this.load.audio('building_destroyed', ['audio/buildingdestroyed.wav']);
    this.load.audio('cannon', ['audio/cannon.wav']);
    this.load.audio('coin_steal', ['audio/coinSteal.wav']);
    this.load.audio('levelEnd', ['audio/levelEnd.mp3']);
    // this.load.audio('loadingScreenStartup', ['audio/loadingScreenStartup.wav']);

    window.music = game.add.audio('music');
    window.music.loop = true;
    window.music.volume = 1;

    window.sound.balloon_hit = game.add.audio('balloon_hit');
    window.sound.balloon_hit.loop = false;

    window.sound.barbarian_hit = game.add.audio('barbarian_hit');
    window.sound.barbarian_hit.loop = false;

    window.sound.building_destroyed = game.add.audio('building_destroyed');

    window.sound.cannon = game.add.audio('cannon');

    window.sound.coin_steal = game.add.audio('coin_steal');

    window.sound.level_end = game.add.audio('levelEnd');

      // loading_screen_startup: game.add.audio('loadingScreenStartup')
  },
  create: function () {
    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

    setTimeout(this.startGame.bind(this), 500);
  },
  startGame: function() {
    // window.music.play();
    // window.sound.loading_screen_startup.play();
    // window.music.play();
    // this.state.start('BalloonLevel');
    // this.state.start('GiantLevel');
    if(window.viewable) {
      this.state.start('GoblinLevel');
      // this.state.start('GiantLevel');
      // this.state.start('BalloonLevel');
    }
    else {
      setTimeout(this.startGame.bind(this), 200);
    }
  },
  update: function () {
    //  You don't actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you'll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it's best to wait for it to decode here first, then carry on.

    //  If you don't have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.

    // if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
    // {
    //   this.ready = true;
    //   // this.state.start('MainMenu');
    // }
  },
  performInstallButtonLogic: performInstallButtonLogic,
  configureADCLogoAndInstallButton: function() {
    var isLandscape = window.innerWidth > window.innerHeight;
    //portrait
    if (!isLandscape) {
      if(device_type == 'phone') {
      }
      else {
        this.adcLogo.x = 1150;
      }
    }
    //landscape
    else {
      if(device_type == 'phone') {
        // this.adcLogo.x = ;
        // this.installButton.x = ;
      }
      else {
        this.adcLogo.x = 1080;
        // this.installButton.x = ;
      }
    }
  }
};
