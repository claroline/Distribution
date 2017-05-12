import React, { Component } from 'react'
import Bar from './bar.jsx'

const T = React.PropTypes

/**
 * Represents data on a Bar chart.
 * data must be an object
 * data {
 *  key1: value1,
 *  key2: value2
 * }
 * where keys will be the values displayed on the x axis and values the ones on the y axis
 */
export default class DataSeries extends Component {
  render() {
    return (
      <g>
        {Object.keys(this.props.data).map((key, i) => (
          <Bar
            key={i}
            height={this.props.yScale(this.props.data[key])}
            width={this.props.xScale.bandwidth()}
            offset={this.props.xScale(key)}
            maxHeight={this.props.height}
            color={this.props.color}
          />
        ))}
      </g>
    )
  }
}

DataSeries.propTypes = {
  data: T.object.isRequired,
  yScale: T.func.isRequired,
  xScale: T.func.isRequired,
  width: T.number.isRequired,
  height: T.number.isRequired,
  color: T.string
}

DataSeries.defaultProps = {
  color: '#337ab7' // Default bootstrap primary color
}
