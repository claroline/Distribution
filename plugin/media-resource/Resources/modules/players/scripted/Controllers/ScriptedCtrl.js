import WaveSurfer from 'wavesurfer.js/dist/wavesurfer'
import 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min'
import 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min'
import 'wavesurfer.js/dist/plugin/wavesurfer.regions.min'


class PauseCtrl {

  constructor($scope, path, unsafe, url, configService, helpModalService, regionsService) {
    console.log('construct ctrl scripted active')
    console.log(this.resource)
    /*this.wavesurfer = Object.create(WaveSurfer)
    this.configService = configService
    this.urlService = url
    this.helpModalService = helpModalService
    this.regionsService = regionsService
    this.setSharedData()
    this.initWavesurfer()
    this.initContentEditable()
    this.playing = false
    this.$scope = $scope

    this.currentRegion = null
    if (this.resource.regions.length > 0) {
      this.currentRegion = this.resource.regions[0]
    }*/
  }

  setSharedData() {
    this.options = this.configService.getWavesurferOptions()
    this.modes = this.configService.getAvailablePlayModes()
  }

  initWavesurfer() {
    const progressDiv = document.querySelector('#progress-bar')
    const progressBar = progressDiv.querySelector('.progress-bar')
    const showProgress = function(percent) {
      progressDiv.style.display = 'block'
      progressBar.style.width = percent + '%'
    }
    const hideProgress = function() {
      progressDiv.style.display = 'none'
    }
    this.wavesurfer.on('loading', showProgress)
    this.wavesurfer.on('ready', hideProgress)
    this.wavesurfer.on('destroy', hideProgress)
    this.wavesurfer.on('error', hideProgress)

    this.wavesurfer.init(this.options)
    this.wavesurfer.initMinimap({
      height: 30,
      waveColor: '#ddd',
      progressColor: '#999',
      cursorColor: '#999'
    })
    this.audioData = this.urlService('innova_get_mediaresource_resource_file', {
      workspaceId: this.resource.workspaceId,
      id: this.resource.id
    })
    this.wavesurfer.load(this.audioData)

    this.wavesurfer.on('ready', function() {
      const timeline = Object.create(WaveSurfer.Timeline)
      timeline.init({
        wavesurfer: this.wavesurfer,
        container: '#wave-timeline'
      })

    }.bind(this))

    this.wavesurfer.on('seek', function() {
      const current = this.regionsService.getRegionFromTime(this.wavesurfer.getCurrentTime(), this.resource.regions)
      if (current && this.currentRegion && current.uuid != this.currentRegion.uuid) {
                // update current region
        this.currentRegion = current
      }
    }.bind(this))

    this.wavesurfer.on('audioprocess', function() {
      const current = this.regionsService.getRegionFromTime(this.wavesurfer.getCurrentTime(), this.resource.regions)
      if (current && this.currentRegion && current.uuid != this.currentRegion.uuid) {
                // update current region
        this.currentRegion = current
      }
    }.bind(this))
  }



  getMarkerLeftPostionFromTime(time) {
    const duration = this.wavesurfer.getDuration()
    const $canvas = $('#waveform').find('wave').first().find('canvas').first()
    const cWidth = $canvas.width()
    return time * cWidth / duration
  }

  getTimeFromPosition(position) {
    const duration = this.wavesurfer.getDuration()
    const $canvas = $('#waveform').find('wave').first().find('canvas').first()
    const cWidth = $canvas.width()
    return position * duration / cWidth
  }

  hasHelp(helps) {
    return this.regionsService.regionHasHelp(helps) // helps && (helps.backward || helps.helpRegionUuid || helps.helpLinks.filter(el => el.url !== '').length > 0 || helps.helpTexts.filter(el => el.text !== '').length > 0 || helps.loop || helps.rate)
  }


  play() {
    if (!this.playing) {
      this.wavesurfer.play()
      this.playing = true
    } else {
      this.wavesurfer.pause()
      this.playing = false
    }
  }

  playRegion(region) {
    const wRegion = this.wavesurfer.addRegion({
      start: region ? region.start : this.currentRegion.start,
      end: region ? region.end : this.currentRegion.end,
      color: 'rgba(0,0,0,0)',
      drag: false,
      resize: false
    })
    if (!this.playing) {
      wRegion.play()
      this.playing = true
      this.wavesurfer.once('pause', function() {
        this.playing = false
      }.bind(this))
    } else {
      this.wavesurfer.pause()
      this.playing = false
    }
  }



  help() {
    let previous = null
        // search for prev region only if we are not in the first one
    if (this.currentRegion.start > 0) {
      for (let region of this.resource.regions) {
        if (region.end === this.currentRegion.start) {
          previous = region
        }
      }
    }

    if (this.playing) {
      if (this.wavesurfer.isPlaying()) {
        this.wavesurfer.pause()
      }
      this.playing = false
    }

    this.helpModalService.setData(this.currentRegion, previous, this.resource.regions, this.audioData, this.resource.options.lang)
    this.helpModalService.open()
  }


}

PauseCtrl.$inject = [
  '$scope',
  'pathFilter',
  'unsafeFilter',
  'url',
  'configService',
  'helpModalService',
  'regionsService',
]
export default PauseCtrl
