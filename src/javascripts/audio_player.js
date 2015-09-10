var $ = require('jquery'),
    tmpl = require('riot-tmpl'),
    Plugin = require('./plugin.js')

var Toyplay = function (element, options) {
  this.$element = $(element)
  this.options = options
  this.appendPlayer()
}

Toyplay.DEFAULTS = {
  template: [
  //'<p><i class="icon-camera-retro icon-large"></i> icon-camera-retro</p>',
    '<div class = "toyplayer-song-image">',
      '<img src = {imageSrc[songNumber]}></img>',
    '</div>',

    '<div class = "toyplayer-controls">',

      '<button class="toyplayer-button-play">{PLAY}</button>',

      '<div class="toyplayer-extra-controls">',
        '<span class="toyplayer-current-time">00.00</span>',
        '<span class="toyplayer-duration-time">00.00</span>',
        '<a class="toyplayer-button-slower">-30c</a>',
        '<a class="toyplayer-button-faster">+30c</a>',
      '</div>',

      '<button class="toyplayer-button-volume">{MUTE}</button>',

      '<div class="toyplayer-volume-bar-block" class="hidden">',
        '<span class="toyplayer-volume-change-bar-roller">',
        '<span class="toyplayer-volume-change-bar-value"></span>',
        '</span>',
      '</div>',

      '<div class="toyplayer-progress">',
        '<span class="toyplayer-progress-value"></span>',
      '</div>',

      '<button class="toyplayer-button-previous">{PREV}</button>',

      '<div class="toyplayer-song-name">',
        '<p>{song[songNumber]}</p>',
        '<p>{artist[songNumber]}</p>',
      '</div>',

      '<button class="toyplayer-button-next">{NEXT}</button>',

    '</div>',

    '<audio>Canvas not supported</audio>'

  ].join(''),

  imageSrc: [
    'http://i.allday2.com/d3/b8/a1/thumbs/1362952007_07.jpg',
    'http://assets.worldwildlife.org/photos/946/images/story_full_width/forests-why-matter_63516847.jpg?1345534028',
    'http://orig15.deviantart.net/b78d/f/2013/127/9/7/that_festival_night_by_boxtail-d64ickr.png'
  ],

  songSrc: [
    'http://a.tumblr.com/tumblr_lyr37pUOvg1qbgvpzo1.mp3',
    'http://www.sp-fan.ru/media/music/file/Men_Without_Hats_-_The_Safety_Dance.mp3',
    'http://www.mcdman.com/music/mp3/Fields/PartyHard.mp3'
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

  player: '#player',

  songImage: '.toyplayer-song-image img',

  songName: '.toyplayer-song-name',

  buttonPlay:'.toyplayer-button-play',

  buttonSlower: '.toyplayer-button-slower',

  buttonFaster: '.toyplayer-button-faster',

  buttonVolume: '.toyplayer-button-volume',

  buttonNext: '.toyplayer-button-next',

  buttonPrevious: '.toyplayer-button-previous',

  audio: 'audio',

  volumeBarBlock: '.toyplayer-volume-bar-block',

  volumeChangeRoller: '.toyplayer-volume-change-bar-roller',

  volumeChangeValue: '.toyplayer-volume-change-bar-value',

  progressBar: '.toyplayer-progress',

  progressValue: '.toyplayer-progress-value',

  duration: '.toyplayer-duration-time',

  currentTime: '.toyplayer-current-time',

  songNumber: 0,

  PLAY: '&#xf04b;',

  PAUSE: '&#xf04c;',

  MUTE: '&#xf027;',

  PREV: '&#xf048;',

  NEXT: '&#xf051;'
}

Toyplay.prototype = {
  appendPlayer: function (e) {
    var temporaryTemplate = this.options.template

    temporaryTemplate = tmpl(temporaryTemplate, this.options)
    $(this.$element).append(temporaryTemplate)
    this.listenEvents()
  },

  listenEvents: function () {
    var itOpt = this.options

    $(itOpt.buttonPlay).on('click', $.proxy(this.togglePlay, this))
    $(itOpt.buttonSlower).on('click', $.proxy(this.rewindAudio, this))
    $(itOpt.buttonFaster).on('click', $.proxy(this.forwardAudio, this))
    $(itOpt.audio).on('durationchange', $.proxy(this.showDuration, this))
    $(itOpt.audio).on('timeupdate', $.proxy(this.drawProgressBar, this))
    $(itOpt.audio).on('timeupdate', $.proxy(this.showCurrentTime, this))
    $(itOpt.volumeChangeRoller).on('click', $.proxy(this.volumeChange, this))
    $(itOpt.progressBar).on('click', $.proxy(this.changeCurrentTime, this))
    $(itOpt.buttonVolume).on('click', $.proxy(this.toggleVolumeBar, this))
    $(itOpt.buttonNext).on('click', $.proxy(this.changeSongToNext, this))
    $(itOpt.buttonPrevious).on('click', $.proxy(this.changeSongToPrevious, this))
  },

  togglePlay: function () {
    var audioElm = $(this.options.audio)[0]

    this[audioElm.paused ? 'playAudio' : 'pauseAudio']()
  },

  playAudio: function () {
    var itOpt = this.options,
        audioURL = itOpt.songSrc[itOpt.songNumber],
        audioElm = $(itOpt.audio)[0],
        $btn = $(itOpt.buttonPlay),
        PAUSE = itOpt.PAUSE

    $btn.html(PAUSE)
    audioElm.src = audioURL
    audioElm.play()

    this.displayPicture()
    this.displaySongName()
  },

  pauseAudio: function () {
    var itOpt = this.options,
        audioElm = $(itOpt.audio)[0],
        $btn = $(itOpt.buttonPlay),
        audioURL = itOpt.songSrc[itOpt.songNumber],
        PLAY = itOpt.PLAY

    $btn.html(PLAY); // Set button text == Play
    audioElm.pause()
  },

  showDuration: function () {
    var itOpt = this.options,
        audioElm = $(itOpt.audio)[0],
        $duration = $(itOpt.duration),
        timeInSec = audioElm.duration.toFixed(0)

    $duration.html(this.createMinSecsFormat(timeInSec))
  },

  showCurrentTime: function () {
    var itOpt = this.options,
        audioElm = $(itOpt.audio)[0],
        $duration = $(itOpt.currentTime),
        timeInSec = audioElm.currentTime.toFixed(0)

    $duration.html(this.createMinSecsFormat(timeInSec))
  },

  rewindAudio: function () {
    var audioElm = $(this.options.audio)[0]

    audioElm.currentTime -= 30
  },

  // Fast forwards the audio file by 30 seconds.
  forwardAudio: function () {
    var audioElm = $(this.options.audio)[0]

    audioElm.currentTime += 30
  },

  drawProgressBar: function () {
    var itOpt = this.options,
        audioElm = $(itOpt.audio)[0],
        $progress = $(itOpt.progressValue),
        currentProgress = (100 / audioElm.duration) * audioElm.currentTime + '%'

    $progress.css('width', currentProgress)
  },

  changeCurrentTime: function (e) {
    var itOpt = this.options,
        progress = $(itOpt.progressValue)[0],
        audioElm = $(itOpt.audio)[0],
        $player = $(itOpt.player),
        x = e.pageX - $player.offset().left,
        width = $player.outerWidth(),
        percentage = x / width,
        songPos = Math.round(audioElm.duration * percentage)

    audioElm.currentTime = songPos
    this.drawProgressBar()
  },

  createMinSecsFormat: function (timeInSec) {
    var minutes = Math.floor(timeInSec / 60).toString(),
      seconds = (timeInSec - minutes * 60).toString()

    if (minutes.length < 2) {
      minutes = '0' + minutes
    }

    if (seconds.length < 2) {
      seconds = '0' + seconds
    }

    var result = minutes + '.' + seconds
    return result
  },

  toggleVolumeBar: function () {
    $(this.options.volumeBarBlock).toggleClass('hidden')
  },

  volumeChange: function (e) {
    var itOpt = this.options,
        $volumeBar = $(itOpt.volumeChangeRoller),
        $volumeValue = $(itOpt.volumeChangeValue),
        audioElm = $(itOpt.audio)[0],
        y = e.pageY - $volumeBar.offset().top,
        height = $volumeBar.outerHeight(),
        percentage = 1 - (y / height),
        songPos = Math.round(percentage),
        volumeControlHeight = (percentage * 100) + '%'

    audioElm.volume = percentage
    $volumeValue.css('height', volumeControlHeight)
  },

  changeSongToNext: function () {
    var itOpt = this.options,
        songNumber = itOpt.songNumber,
        songSrc = itOpt.songSrc

    if (songSrc[songNumber + 1]) {
      itOpt.songNumber += 1

      this.playAudio()
    }
  },

  changeSongToPrevious: function () {
    var itOpt = this.options,
        songNumber = itOpt.songNumber,
        songSrc = itOpt.songSrc

    if (songSrc[songNumber - 1]) {
      itOpt.songNumber -= 1

      this.playAudio()
    }
  },

  displayPicture: function () {
    var itOpt = this.options,
        songNumber = itOpt.songNumber,
        imageSrc = itOpt.imageSrc,
        $image = $(itOpt.songImage)

      $image.attr('src', imageSrc[songNumber])
  },

  displaySongName: function () {
    var itOpt = this.options,
        songNumber = itOpt.songNumber,
        song = itOpt.song[songNumber],
        artist = itOpt.artist[songNumber],
        songNameTemplate = '<p>' + song + '</p><p>' + artist + '</p>'

    if (!artist) {
      artist = 'unknown artist'
    }

    if (!song) {
      artist = 'unknown song'
    }

    $(itOpt.songName).html(songNameTemplate)
  }
}

new Plugin('toyplay', Toyplay)

;(function () {
  $('[data-toyplay]').toyplay()
})()

// / Progress-bar example
// / http://codepen.io/ZachCase/pen/LVmVRx
