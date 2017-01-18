import React, {Component, PropTypes as T} from 'react'
import {tex} from './../../utils/translate'
import {ImageInput} from './components/image-input.jsx'
import {ModeSelector} from './components/mode-selector.jsx'
import {actions} from './editor'

export class Graphic extends Component {
  render() {
    return (
      <div className="graphic-editor">
        <div className="top-controls">
          <ImageInput onSelect={file => console.log(file)}/>
          <ModeSelector
            currentMode={this.props.item._editor.mode}
            onChange={mode => this.props.onChange(actions.selectMode(mode))}
          />
        </div>
        <div className="img-dropzone">
          {this.props.item.image.url ?
            'IMG' :
            tex('graphic_drop_or_pick')
          }
        </div>
      </div>
    )
  }
}

Graphic.propTypes = {
  item: T.shape({
    image: T.shape({
      url: T.string.isRequired
    }).isRequired,
    _editor: T.shape({
      mode: T.string.isRequired
    }).isRequired
  }).isRequired,
  onChange: T.func.isRequired
}
