import React, { Component } from 'react'

import ReactDOM from 'react-dom'
import {max, min, range} from 'd3-array'
import {scaleLinear, scaleBand} from 'd3-scale'
import {axisLeft, axisBottom} from 'd3-axis'
import {select} from 'd3-selection'

import Chart from './../base/chart.jsx'
import DataSeries from './data-series.jsx'

const T = React.PropTypes


class Axis extends Component {

  componentDidUpdate() {
    this.renderAxis()
  }

  componentDidMount() {
    this.renderAxis()
  }

  renderAxis() {
    const node = ReactDOM.findDOMNode(this)
    select(node).call(this.props.axis)
  }

  render() {
    const translate = `translate(0, ${this.props.height})`
    return (
      <g className="axis" transform={this.props.axisType === 'x' ? translate : ''} />
    )
  }
}

Axis.propTypes = {
  height: T.number.isRequired,
  axis: T.func.isRequired,
  axisType: T.oneOf(['x','y']).isRequired
}

/**
 * Draws a Bar chart
 */
export default class BarChart extends Component {
  render() {
    const yValues = Object.keys(this.props.data).map(key => { return this.props.data[key] })
    const xValues = []
    Object.keys(this.props.data).forEach(key => {
      if (xValues.indexOf(key) === -1) {
        xValues.push(Number(key))
      }
    })

    const margin = {top: 20, right: 20, bottom: 20, left: 20}
    const width = this.props.width - margin.left - margin.right
    const height = this.props.height - margin.top - margin.bottom

    const yScale = scaleLinear()
      .domain([0, max(yValues)])
      .range([height, 0])

    const xScale = scaleBand()
      .domain([min(xValues), max(xValues)])
      .rangeRound([0, width])
      .paddingInner([0.2])

    const yAxis = axisLeft(yScale)
      .ticks(yValues.length + 1)

    const xAxis = axisBottom(xScale)
      .ticks(xValues.length + 1)
      .tickValues(xValues)

    return (
      <Chart
        width={this.props.width}
        height={this.props.height}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <DataSeries
            data={this.props.data}
            width={width}
            height={height}
            yScale={yScale}
            xScale={xScale}
          />

          <Axis height={height} axis={yAxis} axisType="y" />
          <Axis height={height} axis={xAxis} axisType="x" />
        </g>
      </Chart>
    )
  }
}

BarChart.propTypes = {
  data: T.object.isRequired,
  width: T.number,
  height: T.number
}

BarChart.defaultProps = {
  width: 550,
  height: 400
}
