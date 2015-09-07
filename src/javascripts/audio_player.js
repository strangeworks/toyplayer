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
      '<img src = {imageSrc[songNumber]}></img>',
    '</div>',

    '<div class = "player-controls">',
      '<button id="player-button-play">{PLAY}</button>',

      '<span class="extra-controls">',
        '<span id="player-current-time">00.00</span>',
        '<span id="player-duration-time">00.00</span>',
        '<a id="player-button-slower">-30c</a>',
        '<a id="player-button-faster">+30c</a>',
      '</span>',

      '<button id="player-button-volume">{MUTE}</button>',

      '<div id="volume-bar-wrapper" class="hidden">',
        '<span id="volume-change-bar-background">',
          '<span id="volume-change-bar-value"></span>',
        '</span>',
      '</div>',

      '<span class="player-progress">',
        '<span class="player-progress-loading"></span>',
        '<span class="player-progress-bar"></span>',
      '</span>',

      '<button id="player-button-previous">{PREV}</button>',
      '<span class="player-song-name">',
        '<p>{song[songNumber]}</p>',
        '<p>{artist[songNumber]}</p>',
      '</span>',
      '<button id="player-button-next">{NEXT}</button>',
    '</div>',

    '<audio>',
      'Sorry, but your browser does not support the <code>audio</code> element.',
    '</audio>',

  ].join(''),

  defaultImageSrc: 'http://www.themarkeworld.com/wp-content/uploads/2012/08/Night-sky.jpg',

  imageSrc: [
    'http://i.allday2.com/d3/b8/a1/thumbs/1362952007_07.jpg',
    'http://assets.worldwildlife.org/photos/946/images/story_full_width/forests-why-matter_63516847.jpg?1345534028',
    'http://orig15.deviantart.net/b78d/f/2013/127/9/7/that_festival_night_by_boxtail-d64ickr.png'
  ],

  songSrc: [
    'https://dl-web.dropbox.com/get/07_asaf_avidan_lets_just_call_it_fate_myzuka.org.mp3?_subject_uid=416956950&w=AABXpdxm3YOSsXxWfvVd7bR-TWq2srTazdrBrMKNzItp5w',
    'https://dl-web.dropbox.com/get/04_asaf_avidan_cyclamen_myzuka.org.mp3?_subject_uid=416956950&w=AACkPx4254foi-B5fKgzsRMVatohP_q72RPs6685wrr-Ig',
    'https://dl-web.dropbox.com/get/03_asaf_avidan_love_it_or_leave_it_myzuka.org.mp3?_subject_uid=416956950&w=AAARxWsnDUEQyouWWFd2tmsZ0SK-OmCP_n-uxAW8no3wgQ'
  ],

  song: [
    'Different Pulses',
    'Cyclamen',
    'Love it or leave it'
  ],

  artist: [
    'Asaf Avidan',
    'Asaf Avidan',
    'Asaf Avidan'
  ],

  songNumber: 0,

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
    this.listenEvents();
  },

  listenEvents: function () {
    $('#player-button-play').on('click', $.proxy(this.togglePlay, this));
    $('#player-button-slower').on('click', $.proxy(this.rewindAudio, this));
    $('#player-button-faster').on('click', $.proxy(this.forwardAudio, this));
    $('audio').on('durationchange', $.proxy(this.showDuration, this));
    $('audio').on('timeupdate', $.proxy(this.drawProgressBar, this));
    $('audio').on('timeupdate', $.proxy(this.showCurrentTime, this));
    //$('audio').on('volumechange', $.proxy(this.volumeChange, this));
    $('#volume-change-bar-background').on('click', $.proxy(this.volumeChange, this));
    //$('audio').on('progress', $.proxy(this.showLoading, this));
    $('.player-progress').on('click', $.proxy(this.changeCurrentTime, this));
    $('#player-button-volume').on('click', $.proxy(this.toggleVolumeBar, this));
    $('#player-button-next').on('click', $.proxy(this.changeSongToNext, this));
    $('#player-button-previous').on('click', $.proxy(this.changeSongToPrevious, this));
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
    var audioURL = this.options.songSrc[this.options.songNumber],
        audioElm = document.querySelector('audio'),
        btn = document.querySelector('#player-button-play'),
        PAUSE = this.options.PAUSE;
    btn.innerHTML = PAUSE; // Set button text == Pause
    // Get file from text box and assign it to the source of the audio element
    audioElm.src = audioURL;
    audioElm.play();

    this.changePicture();
    this.changeSongName();
  },

  pauseAudio: function () {
    var audioElm = document.querySelector('audio'),
        btn = document.querySelector('#player-button-play'),
        audioURL = this.options.songSrc[this.options.songNumber],
        PLAY = this.options.PLAY;

    btn.innerHTML = PLAY; // Set button text == Play
    audioElm.pause();
  },

  showDuration: function () {
    var audioElm = document.querySelector('audio'),
        duration = document.querySelector('#player-duration-time'),
        timeInSec = audioElm.duration.toFixed(0);

    duration.innerHTML = this.createMinSecsFormat(timeInSec);
  },

  showCurrentTime: function() {
    var audioElm = document.querySelector('audio'),
        duration = document.querySelector('#player-current-time'),
        timeInSec = audioElm.currentTime.toFixed(0);

    duration.innerHTML = this.createMinSecsFormat(timeInSec);
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

  drawProgressBar: function() {
    var audioElm = document.querySelector('audio'),
        progress = document.querySelector('.player-progress-bar'),
        currentProgress = (100/audioElm.duration) * audioElm.currentTime + '%';

    $(progress).css('width', currentProgress);
  },

  /*showLoading: function(){
    var audioElm = document.querySelector('audio');
    var progressLoad = document.querySelector('.player-progress-loading');
    var currentProgress = (100/audioElm.duration) * audioElm.buffered + '%';
    $(progressLoad).css('width', currentProgress);
    console.log("Start: " + audioElm.buffered.start(0)
+ " End: " + audioElm.buffered.end(0));
  },*/

  changeCurrentTime: function(e) {
    var progress      = document.querySelector('.player-progress-bar'),
      audioElm        = document.querySelector('audio'),
      $player         = $('#player'),
      x               = e.pageX - $player.offset().left,
      width           = $player.outerWidth(),
      percentage      = x / width,
      songPos         = Math.round(audioElm.duration * percentage);

    audioElm.currentTime = songPos;
    this.drawProgressBar();
  },

  createMinSecsFormat: function(timeInSec) {
    var minutes = Math.floor(timeInSec / 60).toString();
    var seconds = (timeInSec - minutes * 60).toString();

    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }

    var result = minutes + '.' + seconds;
    return result;
  },

  toggleVolumeBar: function() {
    $('#volume-bar-wrapper').toggleClass('hidden');
  },

  volumeChange: function(e) {
    var $volumeBar      = $(document.querySelector('#volume-change-bar-background')),
        $volumeValue    = $(document.querySelector('#volume-change-bar-value')),
        audioElm        = document.querySelector('audio'),
        y               = e.pageY - $volumeBar.offset().top,
        height          = $volumeBar.outerHeight(),
        percentage      = 1 - (y / height),
        songPos         = Math.round(percentage);

    audioElm.volume = percentage;
    var volumeControlHeight = (percentage * 100) + '%';
    $volumeValue.css('height', volumeControlHeight);

  },

  changeSongToNext: function() {
    var songNumber      = this.options.songNumber,
        songSrc         = this.options.songSrc;

    if (songSrc[songNumber+1]) {
      this.options.songNumber += 1;
      console.log(this.options.songNumber);
      this.playAudio();
    }
  },

  changeSongToPrevious: function() {
    var songNumber      = this.options.songNumber,
        songSrc         = this.options.songSrc;

    if (songSrc[songNumber-1]) {
      this.options.songNumber -= 1;
      console.log(this.options.songNumber);
      this.playAudio();
    }
  },

  changePicture: function() {
    var songNumber      = this.options.songNumber,
        imageSrc        = this.options.imageSrc,
        $image          = $(document.querySelector('img'));

    if (imageSrc[songNumber]) {
      $image.attr('src', imageSrc[songNumber]);
    }
    else {
      $image.attr('src', this.options.defaultImageSrc);
    }
  },

  changeSongName: function() {
    var songNumber      = this.options.songNumber,
        song            = this.options.song[songNumber],
        artist          = this.options.artist[songNumber];

      if(!artist) {
        artist = 'unknown artist';
      }

      if(!song) {
        artist = 'unknown song';
      }

      document.querySelector('.player-song-name').innerHTML = ('<p>'+song+'</p><p>'+artist+'</p>');
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
