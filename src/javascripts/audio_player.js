var $ = require('jquery');

/*if($('[data-toyplay]').data(toyplay.plugin)){
  $('[data-toyplay]').data(toyplay.plugin, '');
}*/

//$('[data-toyplay]').data('toyplay.plugin', '');

var Plugin = require('./plugin.js');

var Toyplay = function(element, options) {
  this.$element = $(element)
  this.options = options
  //this.$element.on('load', $.proxy(this.appendPlayer, this))
  this.appendPlayer.call(this);
}

Toyplay.DEFAULTS = {

  topBlockTemplate: [
    '<div class = "top-block">',
    '</div>'
  ].join(''),

  bottomBlockTemplate: [
    '<div class = "bottom-block">',
    '</div>'
  ].join(''),

  pictureTemplate: [
    '<img src = {src}>',
    '</img>'
  ].join(''),

  buttonTemplate: [
    '<button>',
      '{data}',
    '</button>'
  ].join(''),

  songInformTemplate: [
    '<div>',
      '<p>',
        '{song}',
      '</p>',
      '<p>',
        '{artist}',
      '{/p>',
    '</div>'
  ].join(''),

  progressBarTemplate: [
    '<progress value="0">',
    '</progress>'
  ],

  song: 'Different Pulsuses',

  artist: 'Asaf Avidan',

  pictureSrc: 'http://static.universal-music.de/asset_new/283875/348/view/Different-Pulses.jpg'

}

Toyplay.prototype = {

  appendPlayer: function(e) {
    this.createTopBlock();
    this.createBottomBlock();
  },

  createTopBlock: function() {
    this.createPicture();
    this.createButton('play');
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
  }
}

new Plugin('toyplay', Toyplay);

(function() {
  $('[data-toyplay]').toyplay();
})()
