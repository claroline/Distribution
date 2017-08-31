import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/core/asset'
import {tex} from '#/main/core/translation'
import {POINTER_PLACED} from './enums'
import {PointableImage} from './components/pointable-image.jsx'

export class GraphicPlayer extends Component {
  constructor(props) {
    super(props)
    this.onClickImage = this.onClickImage.bind(this)
    this.onUndo = this.onUndo.bind(this)
    this.state = {
      pointers: [],
      pointersLeft: props.item.pointers
    }
  }

  onClickImage(e, k, pMode) {

    if (this.state.pointersLeft > 0) {
      const factor = this.props.item.image.width / this.img.width
      const imgRect = this.img.getBoundingClientRect()
      const clientX = e.clientX - imgRect.left
      const clientY = e.clientY - imgRect.top
      const absX = Math.round(clientX * factor)
      const absY = Math.round(clientY * factor)

      if(pMode === 'label') {
        this.setState({
          pointers: [...this.state.pointers, {
            x: k,
            y: k,
            id: k,
            zoneAnswer: e.target.value
          }],
          pointersLeft: this.state.pointersLeft - 1
        }, () => this.props.onChange(this.state.pointers))
      }
      else {
        this.setState({
          pointers: [...this.state.pointers, {
            x: absX,
            y: absY,
          }],
          pointersLeft: this.state.pointersLeft - 1
        }, () => this.props.onChange(this.state.pointers))
      }

    }
  }

  onUndo() {
    this.setState({
      pointers: this.state.pointers.slice(
        0,
        this.state.pointers.length - 1
      ),
      pointersLeft: this.state.pointersLeft + 1
    }, () => this.props.onChange(this.state.pointers))
  }

  render() {
    return (
      <div className="graphic-player">
        <div className="top-controls">
          <span>
            {this.props.item.pointerMode &&
              <div>
                Mode : {this.props.item.pointerMode}
              </div>
            }
            {tex('graphic_pointers_left')}{this.state.pointersLeft}
          </span>
          {this.state.pointers.length > 0 &&
            <button
              type="button"
              className="btn btn-default"
              onClick={this.onUndo}
            >
              <span className="fa fa-fw fa-undo"/>&nbsp;{tex('undo')}
            </button>
          }
        </div>
        <PointableImage
          answer={this.props.answer} // A vérifier
          solutions={this.props.item.solutions}
          pointerMode={this.props.item.pointerMode}
          src={this.props.item.image.data || asset(this.props.item.image.url)}
          absWidth={this.props.item.image.width}
          onRef={el => this.img = el}
          onClick={this.onClickImage}
          onChange={this.props.onChange}
          pointers={this.state.pointers.map(pointer => ({
            type: POINTER_PLACED,
            absX: pointer.x,
            absY: pointer.y
          }))}
        />
        {this.props.item.pointerMode === 'image' &&
          <div>{/*Exemple, il faut faire les images dynamiquement*/}
            <img
              src={this.props.item.image.data || asset(this.props.item.image.url)}
              //onRef={el => this.img = el}
              onClick={this.onClickImage}
              style={{width: 152, margin: "5px 5px 5px 0px"}}
            />
            <img
              src={this.props.item.image.data || asset(this.props.item.image.url)}
              //onRef={el => this.img = el}
              onClick={this.onClickImage}
              style={{width: 152, margin: "5px 5px 5px 0px"}}
            />
            <img
              src={this.props.item.image.data || asset(this.props.item.image.url)}
              //onRef={el => this.img = el}
              onClick={this.onClickImage}
              style={{width: 152, margin: "5px 5px 5px 0px"}}
            />
            <img
              src={this.props.item.image.data || asset(this.props.item.image.url)}
              //onRef={el => this.img = el}
              onClick={this.onClickImage}
              style={{width: 152, margin: "5px 5px 5px 0px"}}
            />
            <img
              src={this.props.item.image.data || asset(this.props.item.image.url)}
              //onRef={el => this.img = el}
              onClick={this.onClickImage}
              style={{width: 152, margin: "5px 5px 5px 0px"}}
            />
          </div>
        }
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
