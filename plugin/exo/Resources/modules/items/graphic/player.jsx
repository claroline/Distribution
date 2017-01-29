import React, {Component, PropTypes as T} from 'react'
import {asset} from '#/main/core/asset'
import {tex} from './../../utils/translate'
import {POINTER_PLACED} from './enums'
import {Pointer} from './components/pointer.jsx'

export class GraphicPlayer extends Component {
  constructor(props) {
    super(props)
    this.onResize = this.onResize.bind(this)
    this.onClickImage = this.onClickImage.bind(this)
    this.onUndo = this.onUndo.bind(this)
    this.state = {
      pointerCoords: [],
      pointersLeft: props.item.pointers
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  onResize() {
    const factor = this.props.item.image.width / this.img.width
    this.setState({
      pointerCoords: this.state.pointerCoords.map(coords => ({
        x: coords.x,
        y: coords.y,
        _clientX: Math.round(coords.x / factor),
        _clientY: Math.round(coords.y / factor)
      }))
    })
  }

  onClickImage(e) {
    if (this.state.pointersLeft > 0) {
      const factor = this.props.item.image.width / this.img.width
      const imgRect = e.target.getBoundingClientRect()
      const clientX = e.clientX - imgRect.left
      const clientY = e.clientY - imgRect.top
      const absX = Math.round(clientX * factor)
      const absY = Math.round(clientY * factor)

      const newCoords = {
        x: absX,
        y: absY,
        _clientX: e.clientX - imgRect.left,
        _clientY: e.clientY - imgRect.top
      }

      this.setState({
        pointerCoords: [...this.state.pointerCoords, newCoords],
        pointersLeft: this.state.pointersLeft - 1
      }, () => this.props.onChange(this.state.pointerCoords))
    }
  }

  onUndo() {
    this.setState({
      pointerCoords: this.state.pointerCoords.slice(
        0,
        this.state.pointerCoords.length - 1
      ),
      pointersLeft: this.state.pointersLeft + 1
    }, () => this.props.onChange(this.state.pointerCoords))
  }

  render() {
    return (
      <div className="graphic-player">
        <div className="top-controls">
          <span>
            {tex('graphic_pointers_left')}{this.state.pointersLeft}
          </span>
          {this.state.pointerCoords.length > 0 &&
            <button
              type="button"
              className="btn btn-default"
              onClick={this.onUndo}
            >
              <span className="fa fa-undo"/>&nbsp;{tex('undo')}
            </button>
          }
        </div>
        <div
          className="img-container"
          style={{
            position: 'relative',
            cursor: this.state.pointersLeft ? 'crosshair' : 'auto',
            userSelect: 'none'
          }}
        >
          <img
            ref={el => this.img = el}
            className="main-img"
            src={this.props.item.image.data || asset(this.props.item.image.url)}
            draggable={false}
            onDragStart={e => e.stopPropagation()}
            onClick={this.onClickImage}
          />
          {this.state.pointerCoords.map((coords, idx) =>
            <Pointer
              key={idx}
              x={coords._clientX}
              y={coords._clientY}
              type={POINTER_PLACED}
            />
          )}
        </div>
      </div>
    )
  }
}

GraphicPlayer.propTypes = {
  item: T.shape({
    image: T.oneOfType([
      T.shape({
        data: T.string.isRequired,
        width: T.number.isRequired
      }),
      T.shape({
        url: T.string.isRequired,
        width: T.number.isRequired
      })
    ]).isRequired,
    pointers: T.number.isRequired
  }).isRequired,
  onChange: T.func.isRequired
}
