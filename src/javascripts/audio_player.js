var $ = require('jquery');
var tmpl = require ('riot-tmpl');

var Plugin = require('./plugin.js');

var Toyplay = function(element, options) {
  this.$element = $(element)
  this.options = options
  this.appendPlayer.call(this);
}

Toyplay.DEFAULTS = {

  template: [
    '<div class = "top-part-player">',
      '<img src = {src}></img>',
      '<button>{play}</button>',
      '<button>{mute}</button>',
    '</div>',

    '<div class = "bottom-part-player">',
      '<progress value="0"></progress>',
      '<button>{prev}</button>',
      '<span>',
        '<p>{song}</p>',
        '<p>{artist}</p>',
      '</span>',
      '<button>{next}</button>',
    '</div>'
  ].join(''),

  song: 'Different Pulsuses',

  artist: 'Asaf Avidan',

  src: 'http://static.universal-music.de/asset_new/283875/348/view/Different-Pulses.jpg',

  play: '&#xf04b;',

  mute: '&#xf027;',

  prev: '&#xf048;',

  next: '&#xf051;'
}

Toyplay.prototype = {

  appendPlayer: function(e) {

    var temperaryTemplate = this.options.template;
    temperaryTemplate = tmpl(temperaryTemplate, this.options);
    $(this.$element).append(temperaryTemplate);

  }

  /*createTopBlock: function() {
    this.createPicture();
    this.createButton('&#xe600;');
    this.createButton('mute');
  },

  createBottomBlock: function() {
    this.createProgressBar();
    this.createSongInformTeplate();
    this.createButton('prev');
    this.createButton('next');
  },

  createPicture: function() {
    var pictureTemperaryTemplate = this.options.pictureTemplate;
    pictureTemperaryTemplate = pictureTemperaryTemplate.replace('{src}', this.options.pictureSrc);
    $(this.$element).append(pictureTemperaryTemplate);

  },

  createButton: function(icon) {
    var buttonTemperaryTemplate = this.options.buttonTemplate;
    buttonTemperaryTemplate = buttonTemperaryTemplate.replace('{data}', icon);
    $(this.$element).append(buttonTemperaryTemplate);

  },

  createProgressBar: function() {
    var progressBarTemplate = this.options.progressBarTemplate;
    $(this.$element).append(progressBarTemplate);
  },

  createSongInformTeplate: function() {
    var songTemperaryTemplate = this.options.songInformTemplate;
    songTemperaryTemplate = songTemperaryTemplate.replace('{song}', this.options.song);
    songTemperaryTemplate = songTemperaryTemplate.replace('{artist}', this.options.artist);
    $(this.$element).append(songTemperaryTemplate);
  }*/
}

new Plugin('toyplay', Toyplay);

(function() {
  $('[data-toyplay]').toyplay();
})()
