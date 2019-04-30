import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import WaveSurfer from 'wavesurfer';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions'

import {trans} from '#/main/app/intl/translation'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'

class Waveform extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wavesurfer: null,
      playing: false
    }
    this.switchAudio = this.switchAudio.bind(this)
    this.playRegion = this.playRegion.bind(this)
    this.switchRegion = this.switchRegion.bind(this)
  }

  componentDidMount() {
    const plugins = [
      RegionsPlugin.create({
        dragSelection: this.props.editable &&
          (!this.props.maxRegions || (this.props.regions && this.props.regions.length < this.props.maxRegions)),
        slop: 5
      })
    ]

    // Initilize Wavesurfer
    this.setState({
      wavesurfer: WaveSurfer.create({
        container: `#${this.props.id}`,
        scrollParent: true,
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        plugins: plugins
      })
    }, () => {
      // Load audio file
      this.state.wavesurfer.load(this.props.url)

      if (this.props.editable) {
        this.state.wavesurfer.on('region-created', (region) => {
          if (this.props.eventsCallbacks['region-created']) {
            this.props.eventsCallbacks['region-created'](region)
          }
        })
        this.state.wavesurfer.on('region-updated', (region) => {
          if (this.props.eventsCallbacks['region-updated']) {
            this.props.eventsCallbacks['region-updated'](region)
          }
        })
        this.state.wavesurfer.on('region-update-end', (region) => {
          if (this.props.maxRegions && this.props.maxRegions <= Object.keys(this.state.wavesurfer.regions.list).length) {
            this.state.wavesurfer.disableDragSelection()
          }
          if (this.props.eventsCallbacks['region-update-end']) {
            this.props.eventsCallbacks['region-update-end'](region)
          }
        })
        this.state.wavesurfer.on('region-removed', (region) => {
          if (this.props.maxRegions && this.props.maxRegions > Object.keys(this.state.wavesurfer.regions.list).length) {
            this.state.wavesurfer.enableDragSelection({dragSelection: true, slop: 5})
          }
          if (this.props.eventsCallbacks['region-removed']) {
            this.props.eventsCallbacks['region-removed'](region)
          }
        })
        this.state.wavesurfer.on('region-play', (region) => {
          if (this.props.eventsCallbacks['region-play']) {
            this.props.eventsCallbacks['region-play'](region)
          }
        })
        this.state.wavesurfer.on('region-in', (region) => {
          if (this.props.eventsCallbacks['region-in']) {
            this.props.eventsCallbacks['region-in'](region)
          }
        })
        this.state.wavesurfer.on('region-out', (region) => {
          if (this.props.eventsCallbacks['region-out']) {
            this.props.eventsCallbacks['region-out'](region)
          }
        })
        this.state.wavesurfer.on('region-mouseenter', (region) => {
          if (this.props.eventsCallbacks['region-mouseenter']) {
            this.props.eventsCallbacks['region-mouseenter'](region)
          }
        })
        this.state.wavesurfer.on('region-mouseleave', (region) => {
          if (this.props.eventsCallbacks['region-mouseleave']) {
            this.props.eventsCallbacks['region-mouseleave'](region)
          }
        })
        this.state.wavesurfer.on('region-click', (region, e) => {
          if (this.props.eventsCallbacks['region-click']) {
            this.props.eventsCallbacks['region-click'](region, e)
          }
        })
        this.state.wavesurfer.on('region-dblclick', (region, e) => {
          if (this.props.eventsCallbacks['region-dblclick']) {
            this.props.eventsCallbacks['region-dblclick'](region, e)
          } else {
            e.stopPropagation()
            e.preventDefault()
            this.playRegion(region)
          }
        })
      }

      // Necessary to display waveform correctly when the initialization occurs in an undisplayed component
      let refreshInterval = setInterval(() => {
        const waveformEl = document.getElementById(this.props.id)
        const canvas = waveformEl.querySelector('canvas')

        if (canvas.getAttribute('width')) {
          // Initialize existing regions
          this.props.regions.forEach(r => {
            this.state.wavesurfer.addRegion(Object.assign({}, r, {
              resize: this.props.editable,
              drag: this.props.editable,
              color: r.color ?
                r.color :
                r.id === this.props.selectedRegion ?
                  'rgba(29, 105, 153, 0.5)' :
                  'rgba(29, 105, 153, 0.3)'
            }))

            if (r.startTolerance) {
              this.state.wavesurfer.addRegion({
                id: `start-${r.id}`,
                start: r.start - r.startTolerance,
                end: r.start,
                resize: this.props.editable,
                drag: false,
                color: 'rgba(231, 86, 119, 0.3)'
              })
            }
            if (r.endTolerance) {
              this.state.wavesurfer.addRegion({
                id: `end-${r.id}`,
                start: r.end,
                end: r.end + r.endTolerance,
                resize: this.props.editable,
                drag: false,
                color: 'rgba(231, 86, 119, 0.3)'
              })
            }
          })
          clearInterval(refreshInterval)
        } {
          this.state.wavesurfer.drawBuffer()
        }
      }, 2000)
    })
  }

  componentDidUpdate(prevProps) {
    // Required if we want the waveform to be refreshed when another audio file is selected
    if (this.props.url !== prevProps.url) {
      this.state.wavesurfer.clearRegions()
      this.state.wavesurfer.load(this.props.url)
    } else {
      Object.values(this.state.wavesurfer.regions.list).forEach(region => {
        if (-1 < region.id.indexOf('start-') || -1 < region.id.indexOf('end-')) {
          region.remove()
        }
      })
      Object.values(this.state.wavesurfer.regions.list).forEach(region => {
        // Updates wavesurfer regions with given ones
        const propRegion = this.props.regions.find(r => r.id === region.id || r.regionId === region.id)

        if (propRegion) {
          if (propRegion.id === region.id) {
            region.update({
              start: propRegion.start,
              end: propRegion.end,
              resize: this.props.editable,
              drag: this.props.editable,
              color: propRegion.color ?
                propRegion.color :
                propRegion.id === this.props.selectedRegion ?
                  'rgba(29, 105, 153, 0.5)' :
                  'rgba(29, 105, 153, 0.3)'
            })

            if (propRegion.startTolerance) {
              this.state.wavesurfer.addRegion({
                id: `start-${propRegion.id}`,
                start: propRegion.start - propRegion.startTolerance,
                end: propRegion.start,
                resize: this.props.editable,
                drag: false,
                color: 'rgba(231, 86, 119, 0.3)'
              })
            }
            if (propRegion.startTolerance) {
              this.state.wavesurfer.addRegion({
                id: `end-${propRegion.id}`,
                start: propRegion.end,
                end: propRegion.end + propRegion.endTolerance,
                resize: this.props.editable,
                drag: false,
                color: 'rgba(231, 86, 119, 0.3)'
              })
            }
          } else {
            region.remove()

            this.state.wavesurfer.addRegion(Object.assign(
              {},
              propRegion,
              {
                resize: this.props.editable,
                drag: this.props.editable,
                color: propRegion.color ?
                  propRegion.color :
                  propRegion.id === this.props.selectedRegion ?
                    'rgba(29, 105, 153, 0.5)' :
                    'rgba(29, 105, 153, 0.3)'
              }
            ))

            if (propRegion.startTolerance) {
              this.state.wavesurfer.addRegion({
                id: `start-${propRegion.id}`,
                start: propRegion.start - propRegion.startTolerance,
                end: propRegion.start,
                resize: this.props.editable,
                drag: false,
                color: 'rgba(231, 86, 119, 0.3)'
              })
            }
            if (propRegion.endTolerance) {
              this.state.wavesurfer.addRegion({
                id: `end-${propRegion.id}`,
                start: propRegion.end,
                end: propRegion.end + propRegion.endTolerance,
                resize: this.props.editable,
                drag: false,
                color: 'rgba(231, 86, 119, 0.3)'
              })
            }
          }
        } else {
          // Remove deleted regions
          region.remove()
        }
      })
    }
  }

  componentWillUnmount() {
    this.state.wavesurfer.destroy()
  }

  switchAudio() {
    if (this.state.playing) {
      this.state.wavesurfer.pause()
    } else {
      this.state.wavesurfer.play()
    }
    this.setState({playing: !this.state.playing})
  }

  playRegion(region) {
    this.state.wavesurfer.play(region.start, region.end)
    this.setState({playing: true})
  }

  switchRegion(direction = 1) {
    const currentTime = this.state.wavesurfer.getCurrentTime()

    if (0 < direction) {
      // Play the region that will come next
      let next = null

      this.props.regions.forEach(r => {
        if (r.start > currentTime && (!next || r.start < next.start)) {
          next = r
        }
      })

      if (next) {
        this.playRegion(next)
      }
    } else {
      // Replay the current region or play the previous one
      let previous = null

      this.props.regions.forEach(r => {
        if (r.start < currentTime - 1 && (!previous || r.start > previous.start)) {
          previous = r
        }
      })

      if (previous) {
        this.playRegion(previous)
      }
    }
  }

  render() {
    return (
      <div>
        <div id={this.props.id}>
        </div>
        <div id={`${this.props.id}-timeline`}>
        </div>
        <div
          id={`${this.props.id}-cmd`}
          style={{
            marginTop: '10px',
            textAlign: 'center'
          }}
        >
          {0 < this.props.regions.length &&
            <CallbackButton
              className="btn"
              callback={() => this.switchRegion(-1)}
              primary={true}
              size="sm"
              style={{
                marginRight: '10px'
              }}
            >
              <span className="fa fa-fast-backward" />
            </CallbackButton>
          }

          <CallbackButton
            className="btn"
            callback={this.switchAudio}
            primary={true}
            size="sm"
          >
            <span className={`fa fa-${this.state.playing ? 'pause' : 'play'}`} />
            <span style={{marginLeft: '5px'}}>
              {this.state.playing ? trans('pause', {}, 'audio') : trans('play', {}, 'audio')}
            </span>
          </CallbackButton>

          {0 < this.props.regions.length &&
            <CallbackButton
              className="btn"
              callback={() => this.switchRegion()}
              primary={true}
              size="sm"
              style={{
                marginLeft: '10px'
              }}
            >
              <span className="fa fa-fast-forward" />
            </CallbackButton>
          }
        </div>
      </div>
    )
  }
}

Waveform.propTypes = {
  id: T.string.isRequired,
  url: T.string.isRequired,
  editable: T.bool.isRequired,
  regions: T.arrayOf(T.shape({
    id: T.string.isRequired,
    regionId: T.string,
    start: T.number.isRequired,
    end: T.number.isRequired,
    color: T.string
  })),
  selectedRegion: T.string,
  maxRegions: T.number,
  eventsCallbacks: T.object
}

Waveform.defaultProps = {
  editable: true,
  regions: [],
  eventsCallbacks: {}
}

export {
  Waveform
}
