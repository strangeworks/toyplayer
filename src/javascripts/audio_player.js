var $ = require('jquery')
var tmpl = require('riot-tmpl')
var Plugin = require('./plugin.js')

var Toyplay = function (element, options) {
  this.$element = $(element)
  this.options = options
  this.appendPlayer.call(this)
}

Toyplay.DEFAULTS = {
  template: [
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

    '<audio></audio>',

  ].join(''),

  defaultImageSrc: 'http://www.themarkeworld.com/wp-content/uploads/2012/08/Night-sky.jpg',

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

  songNumber: 0,

  PLAY: '&#xf04b;',

  PAUSE: '&#xf04c;',

  MUTE: '&#xf027;',

  PREV: '&#xf048;',

  NEXT: '&#xf051;'
}

Toyplay.prototype = {
  appendPlayer: function (e) {
    var temperaryTemplate = this.options.template
    temperaryTemplate = tmpl(temperaryTemplate, this.options)
    $(this.$element).append(temperaryTemplate)
    this.listenEvents()
  },

  listenEvents: function () {
    $('.toyplayer-button-play').on('click', $.proxy(this.togglePlay, this))
    $('.toyplayer-button-slower').on('click', $.proxy(this.rewindAudio, this))
    $('.toyplayer-button-faster').on('click', $.proxy(this.forwardAudio, this))
    $('audio').on('durationchange', $.proxy(this.showDuration, this))
    $('audio').on('timeupdate', $.proxy(this.drawProgressBar, this))
    $('audio').on('timeupdate', $.proxy(this.showCurrentTime, this))
    $('.toyplayer-volume-change-bar-roller').on('click', $.proxy(this.volumeChange, this))
    $('.toyplayer-progress').on('click', $.proxy(this.changeCurrentTime, this))
    $('.toyplayer-button-volume').on('click', $.proxy(this.toggleVolumeBar, this))
    $('.toyplayer-button-next').on('click', $.proxy(this.changeSongToNext, this))
    $('.toyplayer-button-previous').on('click', $.proxy(this.changeSongToPrevious, this))
  },

  togglePlay: function () {
    var audioElm = document.querySelector('audio')

    if (audioElm.paused) {
      this.playAudio(); //  if player is paused, then play the file
    } else {
      this.pauseAudio(); //  if player is playing, then pause
    }
  },

  playAudio: function () {
    var audioURL = this.options.songSrc[this.options.songNumber],
      audioElm = document.querySelector('audio'),
      btn = document.querySelector('.toyplayer-button-play'),
      PAUSE = this.options.PAUSE

    btn.innerHTML = PAUSE
    audioElm.src = audioURL
    audioElm.play()

    this.displayPicture()
    this.displaySongName()
  },

  pauseAudio: function () {
    var audioElm = document.querySelector('audio'),
      btn = document.querySelector('.toyplayer-button-play'),
      audioURL = this.options.songSrc[this.options.songNumber],
      PLAY = this.options.PLAY

    btn.innerHTML = PLAY; // Set button text == Play
    audioElm.pause()
  },

  showDuration: function () {
    var audioElm = document.querySelector('audio'),
      duration = document.querySelector('.toyplayer-duration-time'),
      timeInSec = audioElm.duration.toFixed(0)

    duration.innerHTML = this.createMinSecsFormat(timeInSec)
  },

  showCurrentTime: function () {
    var audioElm = document.querySelector('audio'),
      duration = document.querySelector('.toyplayer-current-time'),
      timeInSec = audioElm.currentTime.toFixed(0)

    duration.innerHTML = this.createMinSecsFormat(timeInSec)
  },

  rewindAudio: function () {
    if (window.HTMLAudioElement) {
      var audioElm = document.querySelector('audio')
      audioElm.currentTime -= 30
    }
  },

  // Fast forwards the audio file by 30 seconds.
  forwardAudio: function () {
    if (window.HTMLAudioElement) {
      var audioElm = document.querySelector('audio')
      audioElm.currentTime += 30
    }
  },

  drawProgressBar: function () {
    var audioElm = document.querySelector('audio'),
      progress = document.querySelector('.toyplayer-progress-value'),
      currentProgress = (100 / audioElm.duration) * audioElm.currentTime + '%'

    $(progress).css('width', currentProgress)
  },

  changeCurrentTime: function (e) {
    var progress = document.querySelector('.toyplayer-progress-value'),
      audioElm = document.querySelector('audio'),
      $player = $('#player'),
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
    $('.toyplayer-volume-bar-block').toggleClass('hidden')
  },

  volumeChange: function (e) {
    var $volumeBar = $(document.querySelector('.toyplayer-volume-change-bar-roller')),
      $volumeValue = $(document.querySelector('.toyplayer-volume-change-bar-value')),
      audioElm = document.querySelector('audio'),
      y = e.pageY - $volumeBar.offset().top,
      height = $volumeBar.outerHeight(),
      percentage = 1 - (y / height),
      songPos = Math.round(percentage)

    audioElm.volume = percentage
    var volumeControlHeight = (percentage * 100) + '%'
    $volumeValue.css('height', volumeControlHeight)

  },

  changeSongToNext: function () {
    var songNumber = this.options.songNumber,
      songSrc = this.options.songSrc

    if (songSrc[songNumber + 1]) {
      this.options.songNumber += 1
      console.log(this.options.songNumber)

      this.playAudio()
    }
  },

  changeSongToPrevious: function () {
    var songNumber = this.options.songNumber,
      songSrc = this.options.songSrc

    if (songSrc[songNumber - 1]) {
      this.options.songNumber -= 1
      console.log(this.options.songNumber)

      this.playAudio()
    }
  },

  displayPicture: function () {
    var songNumber = this.options.songNumber,
      imageSrc = this.options.imageSrc,
      $image = $(document.querySelector('img'))

    if (imageSrc[songNumber]) {
      $image.attr('src', imageSrc[songNumber])
    } else {
      $image.attr('src', this.options.defaultImageSrc)
    }
  },

  displaySongName: function () {
    var songNumber = this.options.songNumber,
      song = this.options.song[songNumber],
      artist = this.options.artist[songNumber]

    if (!artist) {
      artist = 'unknown artist'
    }

    if (!song) {
      artist = 'unknown song'
    }

    document.querySelector('.toyplayer-song-name').innerHTML = ('<p>' + song + '</p><p>' + artist + '</p>')
  }
}

new Plugin('toyplay', Toyplay)

;(function () {
  $('[data-toyplay]').toyplay()
})()

// / Progress-bar example
// / http://codepen.io/ZachCase/pen/LVmVRx
