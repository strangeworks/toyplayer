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
      '<progress value="0.7"></progress>',
      '<button>{prev}</button>',
      '<span>',
        '<p>{song}</p>',
        '<p>{artist}</p>',
      '</span>',
      '<button>{next}</button>',
    '</div>'
  ].join(''),

  song: 'Different Pulses',

  artist: 'Asaf Avidan',

  src: 'http://cdn-dailyelle.ladmedia.fr/2013/01/clip-asaf-avidan-different-pulses.jpg',

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
}

new Plugin('toyplay', Toyplay);

(function() {
  $('[data-toyplay]').toyplay();
})()
