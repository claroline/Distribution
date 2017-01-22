import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import {tex} from './../../utils/translate'
import {MODE_SELECT, MAX_IMG_SIZE} from './enums'
import {actions} from './actions'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import {ImageInput} from './components/image-input.jsx'
import {ModeSelector} from './components/mode-selector.jsx'
import {AnswerArea} from './components/answer-area.jsx'

export class Graphic extends Component {
  constructor(props) {
    super(props)
    this.onDropImage = this.onDropImage.bind(this)
    this.onSelectImage = this.onSelectImage.bind(this)
    this.onClickImage = this.onClickImage.bind(this)
  }

  componentDidMount() {
    this.renderImageContainerContent()
    this.dropzone.addEventListener('dragenter', this.stopEvent)
    this.dropzone.addEventListener('dragover', this.stopEvent)
    this.dropzone.addEventListener('drop', this.onDropImage)
  }

  renderImageContainerContent() {
    // because we need to access various DOM-related APIs to deal with the image
    // and because letting React compare the url/src attribute (which can be a
    // a very long string if the image is large) could be too heavy, the img tag
    // is rendered outside the React pipeline and just attached to a leaf node
    // of the component.
    if (this.props.item.image.url) {
      this.createImage(this.props.item.image.url)
    } else {
      this.imgContainer.innerHTML = tex('graphic_drop_or_pick')
    }
  }

  componentDidUpdate(prevProps) {
    const img = this.imgContainer.querySelector('img')

    if (img) {
      img.className = this.props.item._mode !== MODE_SELECT ? 'point-mode' : ''

      if (prevProps.item.image.url !== this.props.item.image.url) {
        if (!this.props.item.image.url) {
          this.imgContainer.innerHTML = tex('graphic_drop_or_pick')
        } else {
          img.src = this.props.item.image.url
        }
      }
    }
  }

  componentWillUnmount() {
    this.dropzone.removeEventListener('dragenter', this.stopEvent)
    this.dropzone.removeEventListener('dragover', this.stopEvent)
    this.dropzone.removeEventListener('drop', this.onDropImage)
  }

  stopEvent(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  onDropImage(e) {
    this.stopEvent(e)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.onSelectImage(e.dataTransfer.files[0])
    }
  }

  onSelectImage(file) {
    if (file.type.indexOf('image') !== 0) {
      return this.props.onChange(actions.selectImage({_type: file.type}))
    }

    if (file.size > MAX_IMG_SIZE) {
      return this.props.onChange(actions.selectImage({_size: file.size}))
    }

    const reader = new window.FileReader()
    reader.onload = e => {
      const img = this.createImage(e.target.result)
      img.onload = () => {
        this.props.onChange(actions.selectImage({
          url: e.target.result,
          width: img.naturalWidth,
          height: img.naturalHeight,
          _type: file.type,
          _size: file.size
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  createImage(encodedString) {
    const img = document.createElement('img')
    img.src = encodedString
    img.className = this.props.item._mode !== MODE_SELECT ? 'point-mode' : ''
    img.addEventListener('click', this.onClickImage)
    this.imgContainer.innerHTML = ''
    this.imgContainer.appendChild(img)

    return img
  }

  onClickImage(e) {
    if (this.props.item._mode !== MODE_SELECT) {
      const imgRect = e.target.getBoundingClientRect()
      this.props.onChange(actions.createArea(
        e.clientX - imgRect.left,
        e.clientY - imgRect.top
      ))
    }
  }

  render() {
    return (
      <div className="graphic-editor">
        {get(this.props.item, '_errors.image') &&
          <ErrorBlock
            text={this.props.item._errors.image}
            warnOnly={!this.props.validating}
          />
        }
        <div className="top-controls">
          <ImageInput onSelect={file => this.onSelectImage(file)}/>
          <ModeSelector
            currentMode={this.props.item._mode}
            onChange={mode => this.props.onChange(actions.selectMode(mode))}
          />
        </div>
        <div className="img-dropzone" ref={el => this.dropzone = el}>
          <div className="img-widget">
            <div className="img-container" ref={el => this.imgContainer = el}/>
            {this.props.item.solutions.map(solution =>
              <AnswerArea key={solution.area.id} {...solution.area}/>
            )}
          </div>
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
    solutions: T.arrayOf(T.shape({
      area: T.shape({
        id: T.string.isRequired
      }).isRequired,
    })).isRequired,
    _mode: T.string.isRequired,
    _errors: T.object
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}
