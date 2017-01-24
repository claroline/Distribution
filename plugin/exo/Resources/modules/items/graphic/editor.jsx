import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import {asset} from '#/main/core/asset'
import {tex} from './../../utils/translate'
import {MODE_SELECT, MAX_IMG_SIZE, SHAPE_RECT} from './enums'
import {actions} from './actions'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import {ImageInput} from './components/image-input.jsx'
import {ModeSelector} from './components/mode-selector.jsx'
import {CircleArea, RectArea} from './components/answer-areas.jsx'

export class Graphic extends Component {
  constructor(props) {
    super(props)
    this.draggingArea = false
    this.draggedArea = null
    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onSelectImage = this.onSelectImage.bind(this)
    this.onClickImage = this.onClickImage.bind(this)
    this.onStartDragArea = this.onStartDragArea.bind(this)
    this.onEndDragArea = this.onEndDragArea.bind(this)
    this.onResize = this.onResize.bind(this)
  }

  componentDidMount() {
    this.renderImageContainerContent()
    this.dropzone.addEventListener('dragenter', this.stopEvent)
    this.dropzone.addEventListener('dragover', this.onDragOver)
    this.dropzone.addEventListener('drop', this.onDrop)
    window.addEventListener('resize', this.onResize)
  }

  renderImageContainerContent() {
    // because we need to access various DOM-related APIs to deal with the image
    // and because letting React compare the data/src attribute (which can be a
    // a very long string if the image is large) could be too heavy, the img tag
    // is rendered outside the React pipeline and just attached to a leaf node
    // of the component.
    if (this.props.item.image.data || this.props.item.image.url) {
      const img = this.createImage(this.props.item.image.data, this.props.item.image.url)
      img.onload = () => this.props.onChange(actions.resizeImage(img.width, img.height))
    } else {
      this.imgContainer.innerHTML = tex('graphic_drop_or_pick')
    }
  }

  componentDidUpdate(prevProps) {
    const img = this.imgContainer.querySelector('img')

    if (img) {
      img.className = this.props.item._mode !== MODE_SELECT ? 'point-mode' : ''

      if (prevProps.item.image.data !== this.props.item.image.data) {
        if (!this.props.item.image.data) {
          this.imgContainer.innerHTML = tex('graphic_drop_or_pick')
        } else {
          img.src = this.props.item.image.data
        }
      }
    }
  }

  componentWillUnmount() {
    this.dropzone.removeEventListener('dragenter', this.stopEvent)
    this.dropzone.removeEventListener('dragover', this.onDragOver)
    this.dropzone.removeEventListener('drop', this.onDrop)
    window.removeEventListener('resize', this.onResize)
  }

  stopEvent(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  onDragOver(e) {
    if (this.draggingArea) {
      this.draggedArea.style.visibility = 'hidden'
    }

    this.stopEvent(e)
  }

  onStartDragArea(e, areaId) {
    this.draggingArea = true
    this.draggedArea = e.target
    e.dataTransfer.setData('text/plain', `area:${areaId}`)
  }

  onEndDragArea() {
    this.draggingArea = false
    this.draggedArea.style.visibility = 'visible'
    this.draggedArea = null
  }

  onDrop(e) {
    this.stopEvent(e)

    // image drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.onSelectImage(e.dataTransfer.files[0])
    }

    const text = e.dataTransfer.getData('text')

    // answer area drop
    if (text && text.indexOf('area:') === 0) {
      const areaId = text.slice(5)
      const img = this.imgContainer.querySelector('img')
      const imgRect = img.getBoundingClientRect()
      this.props.onChange(actions.moveArea(
        areaId,
        e.clientX - imgRect.left,
        e.clientY - imgRect.top
      ))
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
          type: file.type,
          data: e.target.result,
          width: img.naturalWidth,
          height: img.naturalHeight,
          _clientWidth: img.width,
          _clientHeight: img.height,
          _size: file.size
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  createImage(encodedString, url) {
    const img = document.createElement('img')
    img.src = encodedString || asset(url)
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

  onResize(e) {
    const img = this.imgContainer.querySelector('img')

    if (img) {
      this.props.onChange(actions.resizeImage(img.width, img.height))
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
              solution.area.shape === SHAPE_RECT ?
                <RectArea
                  key={solution.area.id}
                  id={solution.area.id}
                  color={solution.area.color}
                  selected={solution._selected}
                  onSelect={id => this.props.onChange(actions.selectArea(id))}
                  onDragStart={e => this.onStartDragArea(e, solution.area.id)}
                  onDragEnd={this.onEndDragArea}
                  coords={solution.area.coords.map(coords => ({
                    x: coords._clientX,
                    y: coords._clientY
                  }))}
                /> :
                <CircleArea
                  key={solution.area.id}
                  id={solution.area.id}
                  color={solution.area.color}
                  selected={solution._selected}
                  onSelect={id => this.props.onChange(actions.selectArea(id))}
                  onDragStart={e => this.onStartDragArea(e, solution.area.id)}
                  onDragEnd={this.onEndDragArea}
                  radius={solution.area._clientRadius}
                  center={{
                    x: solution.area.center._clientX,
                    y: solution.area.center._clientY
                  }}
                />
            )}
          </div>
        </div>
      </div>
    )
  }
}

Graphic.propTypes = {
  item: T.shape({
    image: T.oneOfType([
      T.shape({
        data: T.string.isRequired
      }),
      T.shape({
        url: T.string.isRequired
      })
    ]).isRequired,
    solutions: T.arrayOf(T.shape({
      area: T.shape({
        id: T.string.isRequired,
        shape: T.string.isRequired,
        color: T.string.isRequired
      }).isRequired,
    })).isRequired,
    _mode: T.string.isRequired,
    _errors: T.object
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}
