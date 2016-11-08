import React, { Component } from 'react'
import {axisBottom} from 'd3-axis'
import {max, range} from 'd3-array'
import {scaleLinear, scaleBand} from 'd3-scale'

import Chart from './../../base/components/chart.jsx'
import DataSeries from './data-series.jsx'

const T = React.PropTypes

/**
 * Draws a Bar chart
 */
export default class BarChart extends Component {
  render() {
    const yScale = scaleLinear()
      .domain([0, max(this.props.data)])
      .range([0, this.props.height])

    const xScale = scaleBand()
      .domain(range(this.props.data.length))
      .rangeRound([0, this.props.width])
      .paddingInner([0.2])

      /*<path
    className="domain"
    d={axisBottom(xScale)}
    style={{'shapeRendering':'crispEdges'}}
    fill={'#0000FF'}
    stroke={'#FF0000'}
    strokeWidth={1}
      >
      </path>*/

    return (
      <Chart
        width={this.props.width}
        height={this.props.height}
      >
        <DataSeries
          data={this.props.data}
          width={this.props.width}
          height={this.props.height}
        />
      </Chart>
    )
  }
}

BarChart.propTypes = {
  data: T.array.isRequired,
  width: T.number,
  height: T.number
}

BarChart.defaultProps = {
  width: 550,
  height: 400
}