import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import WaveSurfer from 'wavesurfer';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions'

class Waveform extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wavesurfer: null
    }
  }

  componentDidMount() {
    const plugins = []

    if (this.props.editable) {
      plugins.push(
        RegionsPlugin.create({
          dragSelection: true,
          slop: 5
        })
      )
    }

    this.setState({
      wavesurfer: WaveSurfer.create({
        container: '#waveform',
        plugins: plugins
      })
    }, () => {
      this.state.wavesurfer.load(this.props.url)
      this.state.wavesurfer.on('region-created', (region, e) => {
        console.log(region)
        console.log(this.state.wavesurfer)
        this.state.wavesurfer.disableDragSelection()
      })
    })
  }

  render() {
    return (
      <div id="waveform">
      </div>
    )
  }
}

Waveform.propTypes = {
  url: T.string.isRequired,
  editable: T.bool.isRequired,
  maxRegions: T.number
}

Waveform.defaultProps = {
  editable: true
}

export {
  Waveform
}
