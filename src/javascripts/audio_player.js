var $ = require('jquery');

/*if($('[data-toyplay]').data(toyplay.plugin)){
  $('[data-toyplay]').data(toyplay.plugin, '');
}*/

//$('[data-toyplay]').data('toyplay.plugin', '');

var Plugin = require('./plugin.js');

var Toyplay = function(element, options) {
  this.$element = $(element)
  this.options = options
  debugger;
  this.$element.on('load', $.proxy(this.appendPlayer, this))
}

Toyplay.DEFAULTS = {

  topBlockTeplate: [
    '<div class = "top-block">',
    '</div>'
  ].join(''),

  bottomBlockTeplate: [
    '<div class = "bottom-block">',
    '</div>'
  ].join(''),

  pictureTeplate: [
    '<img src = {src}>',
    '</img>'
  ].join(''),

  buttonTeplate: [
    '<button>',
      '{data}',
    '</button>'
  ].join(''),

  songInformTeplate: [
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
    alert('Function works!');
    this.createTopBlock();
    this.createBottoBlock();
  },

  createTopBlock: function() {
    this.createPicture();
    this.createButton('play');
    this.createButton('mute');
  },

  createBottoBlock: function() {
    this.createProgressBar();
    this.createSongInformTeplate();
    this.createButton('prev');
    this.createButton('next');
  },

  createPicture: function() {
    var pictureTemperaryTemplate = this.options.buttonTeplate.clone();
    pictureTemperaryTemplate.replace('{src}', this.options.pictureSrc);
    this.append(pictureTemperaryTemplate);

  },

  createButton: function(icon) {
    var buttonTemperaryTemplate = this.options.buttonTeplate.clone();
    buttonTemperaryTemplate.replace('{data}', icon);
    this.append(buttonTemperaryTemplate);

  },

  createProgressBar: function() {
    this.append(progressBarTemplate);
  },

  createSongInformTeplate: function() {
    var songTemperaryTemplate = this.options.songInformTeplate.clone();
    songTemperaryTemplate.replace('{song}', this.options.song);
    songTemperaryTemplate.replace('{artist}', this.options.artist);
    this.append(songInformTeplate);
  }
}

new Plugin('toyplay', Toyplay);

(function() {
  $('[data-toyplay]').toyplay();
})()
