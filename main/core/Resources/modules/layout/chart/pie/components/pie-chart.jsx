import React, { Component } from 'react'
import {PropTypes as T} from 'prop-types'

import { implementPropTypes } from '#/main/core/scaffolding/prop-types'
import {Chart as ChartTypes} from '#/main/core/layout/chart/prop-types'
import {Chart} from '#/main/core/layout/chart/components/chart.jsx'
import {DataSeries} from '#/main/core/layout/chart/pie/components/data-series.jsx'

/**
 * Draws a Bar chart
 */
class PieChart extends Component {
  render() {
    let radius = this.props.width/2
    return (
      <Chart
        width={this.props.width}
        height={this.props.width}
        margin={{
          'top': radius,
          'left': radius
        }}
      >
        <DataSeries
          data={this.props.data}
          colors={this.props.colors}
          innerRadius={0}
          outerRadius={radius}
          showValue={this.props.showValue}
        />
      </Chart>
    )
  }
}

implementPropTypes(PieChart, ChartTypes, {
  data: T.array.isRequired,
  colors: T.arrayOf(T.string).isRequired,
  showValue: T.bool.isRequired
}, {
  width: 550,
  showValue: true
})

export {
  PieChart
}
