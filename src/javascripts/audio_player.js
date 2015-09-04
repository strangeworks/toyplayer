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
      '<button id="playbutton" class="play">{PLAY}</button>',
      '<button id="mute">{MUTE}</button>',
    '</div>',

    '<div class = "bottom-part-player">',
      '<progress value="0.1" max="100"></progress>',
      '<button id="prev">{PREV}</button>',
      '<span>',
        '<p>{song}</p>',
        '<p>{artist}</p>',
      '</span>',
      '<button id="next">{NEXT}</button>',
    '</div>',

    '<audio controls>',
      'Sorry, but your browser does not support the <code>audio</code> element.',
    '</audio>',
    '<input type="text" id="audiosrc1" size="80" value="http://music.my.mail.ru/file/2f1e9c500db1fcaae5e30a5391a43dba.mp3?session_key=123a5c0ea0ec54f17b536c18e6ddb1f3" />',
    '<input type="text" id="audiosrc2" size="80" value="http://music.my.mail.ru/file/96e6f6856377636eed7f678269d4e453.mp3?session_key=8bb96c1f5061ef8ffe689cee44db8fb6" />',
    '<input type="text" id="audiosrc3" size="80" value="http://music.my.mail.ru/file/2db27b87c67fc0292bfa31305fcfdb9a.mp3?session_key=0a5e273a51fa54fa2a5d3cc7d444a45c" />'
  ].join(''),

  song: 'Different Pulses',

  artist: 'Asaf Avidan',

  src: 'http://i.allday2.com/d3/b8/a1/thumbs/1362952007_07.jpg',

  PLAY: '&#xf04b;',

  PAUSE: '&#xf04c;',

  MUTE: '&#xf027;',

  PREV: '&#xf048;',

  NEXT: '&#xf051;'
}

Toyplay.prototype = {

  appendPlayer: function(e) {
    var temperaryTemplate = this.options.template;
    temperaryTemplate = tmpl(temperaryTemplate, this.options);
    $(this.$element).append(temperaryTemplate);

    $('#playbutton').on('click', $.proxy(this.togglePlay, this));
    $('#prev').on('click', $.proxy(this.rewindAudio, this));
    $('#next').on('click', $.proxy(this.forwardAudio, this));
    $('audio').on('timeupdate', $.proxy(this.timeupdate, this));
    $('progress').on('click', $.proxy(this.changeCurrentTime, this));
  },

  togglePlay: function () {
    var audioElm = document.querySelector('audio');
    if (audioElm.paused == true) {
     this.playAudio();    //  if player is paused, then play the file
    } else {
     this.pauseAudio();   //  if player is playing, then pause
    }
  },

  playAudio: function () {
    var audioURL = document.querySelector('#audiosrc1').value;
    var audioElm = document.querySelector('audio');
    var btn = document.querySelector('#playbutton');
    var PAUSE = this.options.PAUSE;

    btn.innerHTML = PAUSE; // Set button text == Pause
    // Get file from text box and assign it to the source of the audio element
    audioElm.src = audioURL;
    audioElm.play();
  },

  pauseAudio: function () {
    var audioElm = document.querySelector('audio');
    var btn = document.querySelector('#playbutton');
    var audioURL = document.querySelector('#audiosrc1').value;
    var PLAY = this.options.PLAY;

    btn.innerHTML = PLAY; // Set button text == Play
    audioElm.pause();
  },

  rewindAudio: function() {
     // Check for audio element support.
    if (window.HTMLAudioElement) {
      var audioElm = document.querySelector('audio');
      audioElm.currentTime -= 30;
    }
  },

  // Fast forwards the audio file by 30 seconds.
  forwardAudio: function() {
    // Check for audio element support.
    if (window.HTMLAudioElement) {
      var audioElm = document.querySelector('audio');
      audioElm.currentTime += 30;
    }
  },

  timeupdate: function() {
    var audioElm = document.querySelector('audio');
    var progress = document.querySelector('progress');
    var currentProgress = (100/audioElm.duration) * audioElm.currentTime;
    progress.value = currentProgress;
  },

  changeCurrentTime: function(obj) {
    /*var audioElm = document.querySelector('audio');
    var progress = document.querySelector('progress');
    console.log(audioElm.duration);
    var currentProgress = (100/audioElm.duration) * audioElm.currentTime;
    progress.value = currentProgress;*/
    console.log(obj);
    console.log('is ok');
  }
}

new Plugin('toyplay', Toyplay);

(function() {
  $('[data-toyplay]').toyplay();
})()

/*var currentFile = "";
  function playAudio() {
    // Check for audio element support.
    if (window.HTMLAudioElement) {
      try {
        var oAudio = document.getElementById('myaudio');
        var btn = document.getElementById('play');
        var audioURL = document.getElementById('audiofile');

        //Skip loading if current file hasn't changed.
        if (audioURL.value !== currentFile) {
          oAudio.src = audioURL.value;
          currentFile = audioURL.value;
        }

        // Tests the paused attribute and set state.
        if (oAudio.paused) {
          oAudio.play();
          btn.textContent = "Pause";
        }
        else {
          oAudio.pause();
          btn.textContent = "Play";
        }
    }
    catch (e) {
      // Fail silently but show in F12 developer tools console
       if(window.console && console.error("Error:" + e));
      }
    }
  }*/
 /* pub.jumpSong = function(e){
    var x               = e.pageX - $duration.offset().left,
        width           = $duration.outerWidth(),
        percentage      = x / width,
        percentageWidth = percentage * 100,
        pixelWidth      = width * percentage,
        songPos         = Math.round(songDurSec * percentage),
        posMin          = Math.floor(songPos / 60),
        posSec          = ((songPos % 60) < 10) ? "0" + (songPos % 60) : songPos % 60 ;

    Player.pauseSong();

    $currPos.removeClass('animate');
    $currPos.css('width', percentageWidth+"%");

    $currTime.text(posMin+":"+posSec);

    audio[index].currentTime = songPos;

    // Interval to wait for currPos bar to jump to position without animation
    var interval = setInterval(function(){
      if($currPos.outerWidth() == pixelWidth){
        clearInterval(interval);
        $playPause.removeClass('play').addClass('pause');
        Player.playSong();
      }
    }, 10);
  }
  http://codepen.io/ZachCase/pen/LVmVRx
  http://getbootstrap.com/components/#progress
  Progress bars
*/
