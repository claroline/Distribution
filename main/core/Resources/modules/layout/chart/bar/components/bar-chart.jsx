import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'

import { implementPropTypes } from '#/main/core/scaffolding/prop-types'
import {AxisChart as ChartTypes} from '#/main/core/layout/chart/prop-types'
import {Chart} from '#/main/core/layout/chart/components/chart.jsx'
import {DataSeries} from '#/main/core/layout/chart/bar/components/data-series.jsx'
import {Axis} from '#/main/core/layout/chart/components/axis.jsx'
import {scaleAxis} from '#/main/core/layout/chart/utils'
import {
  AXIS_TYPE_X,
  AXIS_TYPE_Y
} from '#/main/core/layout/chart/enums'

/**
 * Draws a Bar chart
 * data must be formed as a key value object collection
 * data : {
 *   key1: {xData: dataForXAxis, yData: dataForYAxis},
 *   key2: {xData: dataForXAxis, yData: dataForYAxis},
 *   ...
 * }
 */
class BarChart extends Component {
  render() {
    const yValues = Object.keys(this.props.data).map(key => { return this.props.data[key].yData })
    const xValues = Object.keys(this.props.data).map(key => { return this.props.data[key].xData })

    const width = this.props.width - this.props.margin.left - this.props.margin.right
    const height = this.props.height - this.props.margin.top - this.props.margin.bottom

    const yScale = scaleAxis(yValues, AXIS_TYPE_Y, height, this.props.minMaxAsYDomain)
    const xScale = scaleAxis(xValues, AXIS_TYPE_X, width)

    return (
      <Chart
        width={this.props.width}
        height={this.props.height}
        margin={this.props.margin}
      >
        <DataSeries
          data={this.props.data}
          height={height}
          yScale={yScale}
          xScale={xScale}
        />
        <Axis
          height={height}
          width={width}
          margin={this.props.margin}
          values={xValues}
          scale={xScale}
          type={AXIS_TYPE_X}
          label={this.props.xAxisLabel}
        />
        <Axis
          height={height}
          width={width}
          margin={this.props.margin}
          values={yValues}
          scale={yScale}
          type={AXIS_TYPE_Y}
          label={this.props.yAxisLabel}
          ticksAsValues={this.props.ticksAsYValues}
        />
      </Chart>
    )
  }
}

implementPropTypes(BarChart, ChartTypes, {
  data: T.object.isRequired
}, {
  width: 550,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 30
  }
})

export {
  BarChart
}
