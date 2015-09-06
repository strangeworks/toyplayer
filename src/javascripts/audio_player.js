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
    '<div class = "player-image">',
      '<img src = {imageSrc}></img>',
    '</div>',

    '<div class = "player-controls">',
      '<button id="player-button-play">{PLAY}</button>',
      '<span class="extra-controls">',
        '<a id="player-button-slower">-30c</a>',
        '<a id="player-button-faster">+30c</a>',
      '</span>',
      '<button id="player-button-mute">{MUTE}</button>',

      '<span class="player-progress">',
        '<span class="player-progress-loading"></span>',
        '<span class="player-progress-bar"></span>',
      '</span>',

      '<button id="player-button-previous">{PREV}</button>',
      '<span class="player-song-name">',
        '<p>{song}</p>',
        '<p>{artist}</p>',
      '</span>',
      '<button id="player-button-next">{NEXT}</button>',
    '</div>',

    '<audio>',
      'Sorry, but your browser does not support the <code>audio</code> element.',
    '</audio>',

    '<input type="text" id="audiosrc3" size="80" value="https://dl-web.dropbox.com/get/03_asaf_avidan_love_it_or_leave_it_myzuka.org.mp3?_subject_uid=416956950&w=AAARxWsnDUEQyouWWFd2tmsZ0SK-OmCP_n-uxAW8no3wgQ" />',
    '<input type="text" id="audiosrc2" size="80" value="https://dl-web.dropbox.com/get/04_asaf_avidan_cyclamen_myzuka.org.mp3?_subject_uid=416956950&w=AACkPx4254foi-B5fKgzsRMVatohP_q72RPs6685wrr-Ig" />',
    '<input type="text" id="audiosrc1" size="80" value="https://dl-web.dropbox.com/get/07_asaf_avidan_lets_just_call_it_fate_myzuka.org.mp3?_subject_uid=416956950&w=AABXpdxm3YOSsXxWfvVd7bR-TWq2srTazdrBrMKNzItp5w" />'
  ].join(''),

  song: 'Different Pulses',

  artist: 'Asaf Avidan',

  imageSrc: 'http://i.allday2.com/d3/b8/a1/thumbs/1362952007_07.jpg',

  songSrc: 'https://dl-web.dropbox.com/get/07_asaf_avidan_lets_just_call_it_fate_myzuka.org.mp3?_subject_uid=416956950&w=AABXpdxm3YOSsXxWfvVd7bR-TWq2srTazdrBrMKNzItp5w',

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

    $('#player-button-play').on('click', $.proxy(this.togglePlay, this));
    $('#player-button-slower').on('click', $.proxy(this.rewindAudio, this));
    $('#player-button-faster').on('click', $.proxy(this.forwardAudio, this));
    $('audio').on('timeupdate', $.proxy(this.timeupdate, this));
    $('audio').on('progress', $.proxy(this.showLoading, this));
    $('.player-progress').on('click', $.proxy(this.changeCurrentTime, this));
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
    var btn = document.querySelector('#player-button-play');
    var PAUSE = this.options.PAUSE;

    btn.innerHTML = PAUSE; // Set button text == Pause
    // Get file from text box and assign it to the source of the audio element
    audioElm.src = audioURL;
    audioElm.play();
  },

  pauseAudio: function () {
    var audioElm = document.querySelector('audio');
    var btn = document.querySelector('#player-button-play');
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
    var progress = document.querySelector('.player-progress-bar');
    var currentProgress = (100/audioElm.duration) * audioElm.currentTime + '%';
    $(progress).css('width', currentProgress);

  },

  showLoading: function(){
    var audioElm = document.querySelector('audio');
    var progressLoad = document.querySelector('.player-progress-loading');
    var currentProgress = (100/audioElm.duration) * audioElm.buffered + '%';
    $(progressLoad).css('width', currentProgress);
    console.log("Start: " + audioElm.buffered.start(0)
+ " End: " + audioElm.buffered.end(0));
  },

  changeCurrentTime: function(e) {

    var progress      = document.querySelector('.player-progress-bar'),
      audioElm        = document.querySelector('audio'),
      $player         = $('#player'),
      x               = e.pageX - $player.offset().left,
      width           = $player.outerWidth(),
      percentage      = x / width,
      songPos         = Math.round(audioElm.duration * percentage);

    audioElm.currentTime = songPos;
    var currentProgress = (100/audioElm.duration) * audioElm.currentTime + '%';
    $(progress).css('width', currentProgress);


    /*var audioElm = document.querySelector('audio');
    var progress = document.querySelector('progress');
    console.log(audioElm.duration);
    var currentProgress = (100/audioElm.duration) * audioElm.currentTime;
    progress.value = currentProgress;*/
   /* console.log(obj);
    console.log('is ok');*/
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
