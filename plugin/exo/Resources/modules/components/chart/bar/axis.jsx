import React, { Component } from 'react'
import {select} from 'd3-selection'

import {
  AXIS_POSITION_LEFT,
  AXIS_POSITION_TOP,
  AXIS_POSITION_RIGHT,
  AXIS_POSITION_BOTTOM,
  AXIS_POSITION_MIDDLE,
  AXIS_TYPE_X,
  AXIS_TYPE_Y,
  AXIS_TYPE_LABEL_X,
  AXIS_TYPE_LABEL_Y
} from './enums'

const T = React.PropTypes

export default class Axis extends Component {

  componentDidUpdate() {
    this.renderAxis()
  }

  componentDidMount() {
    this.renderAxis()
  }

  renderAxis() {
    if (this.props.axis) {
      const node = this.refs.axis
      select(node).call(this.props.axis)
    }
  }

  render() {
    let transform = ''
    switch (this.props.type) {
      case AXIS_TYPE_X:
        if (this.props.position === AXIS_POSITION_MIDDLE) {
          transform = `translate(0, ${this.props.height / 2})`
        } else if (this.props.position === AXIS_POSITION_BOTTOM) {
          transform = `translate(0, ${this.props.height})`
        }
        break
      case AXIS_TYPE_Y:
          if (this.props.position === AXIS_POSITION_MIDDLE) {
            transform = `translate(0, ${this.props.height / 2})`
          } else if (this.props.position === AXIS_POSITION_RIGHT) {
            transform = `translate(${this.props.width}, 0)`
          }
          break
      case AXIS_TYPE_LABEL_X:
        transform = `translate(${(this.props.width - this.props.margin.left - this.props.margin.right) / 2}, ${this.props.height + 40})`
        break
      case AXIS_TYPE_LABEL_Y:
        transform = `translate(${0 - this.props.margin.left + 20}, ${(this.props.height + this.props.margin.top + this.props.margin.bottom) / 2})rotate(-90)`
        break
    }

    return (
      <g className="axis" ref="axis" transform={transform}>
        {this.props.label &&
          <text className="axis-label">{this.props.label}</text>
        }
      </g>
    )
  }
}

Axis.propTypes = {
  height: T.number.isRequired,
  width: T.number.isRequired,
  axis: T.func,
  type: T.oneOf([AXIS_TYPE_X, AXIS_TYPE_Y, AXIS_TYPE_LABEL_X, AXIS_TYPE_LABEL_Y]).isRequired,
  label: T.string,
  margin: T.shape({
    top: T.number.isRequired,
    right: T.number.isRequired,
    bottom: T.number.isRequired,
    left: T.number.isRequired
  }).isRequired,
  position: T.oneOf([AXIS_POSITION_LEFT, AXIS_POSITION_TOP, AXIS_POSITION_RIGHT, AXIS_POSITION_MIDDLE, AXIS_POSITION_BOTTOM]).isRequired
}
