import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'
import {select} from 'd3-selection'
import {axisLeft, axisBottom} from 'd3-axis'

import {
  AXIS_TYPE_X,
  AXIS_TYPE_Y
} from '#/main/core/layout/chart/enums'

class Axis extends Component {

  componentDidUpdate() {
    this.renderAxis()
  }

  componentDidMount() {
    this.renderAxis()
  }

  renderAxis() {
    if (this.props.values && this.props.scale) {
      const node = this.axisNode
      select(node).call(this.formatAxis())
    }
  }

  formatAxis() {
    
    switch (this.props.type) {
      case AXIS_TYPE_X:
        return axisBottom(this.props.scale).tickValues(this.props.values)
      case AXIS_TYPE_Y: {
        let axis = axisLeft(this.props.scale)
        return this.props.ticksAsValues ? axis.tickValues(this.props.values) : axis.ticks(10)
      }

    }
  }

  render() {
    let transform = '', labelTransform = '', labelWidth = this.props.label.show && this.props.label.text.length * 7
    switch (this.props.type) {
      case AXIS_TYPE_X:
        transform = `translate(0, ${this.props.height})`
        labelTransform = `translate(${this.props.width / 2}, 40)`
        break
      case AXIS_TYPE_Y:
        transform = ''
        labelTransform = `translate(${0 - this.props.margin.left + 20}, ${(this.props.height + this.props.margin.top - labelWidth) / 2})rotate(-90)`
        break
    }

    return (
      <g className="axis" ref={(node) => {this.axisNode = node}} transform={transform}>
        {this.props.label.show &&
          <text className="axis-label" transform={labelTransform}>{this.props.label.text}</text>
        }
      </g>
    )
  }
}

Axis.propTypes = {
  height: T.number.isRequired,
  width: T.number.isRequired,
  values: T.array,
  scale: T.func,
  ticksAsValues: T.bool,
  type: T.oneOf([AXIS_TYPE_X, AXIS_TYPE_Y]).isRequired,
  label: T.shape({
    show: T.bool.isRequired,
    text: T.string.isRequired
  }),
  margin: T.shape({
    top: T.number.isRequired,
    right: T.number.isRequired,
    bottom: T.number.isRequired,
    left: T.number.isRequired
  }).isRequired
}

Axis.defaultProps = {
  label: {
    show: false,
    label: ''
  },
  ticksAsValues: false
}

export {
  Axis
}
