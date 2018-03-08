import React from 'react'
import {PropTypes as T} from 'prop-types'

import { implementPropTypes } from '#/main/core/scaffolding/prop-types'
import {Chart as ChartTypes} from '#/main/core/layout/chart/prop-types'
import {Chart} from '#/main/core/layout/chart/components/chart.jsx'
import {DataSeries} from '#/main/core/layout/chart/pie/components/data-series.jsx'

/**
 * Draws a Bar chart
 */
const PieChart = props => {
  let radius = props.width/2
  return (
    <Chart
      width={props.width}
      height={props.width}
      margin={{
        'top': radius,
        'left': radius
      }}
    >
      <DataSeries
        data={props.data}
        colors={props.colors}
        innerRadius={0}
        outerRadius={radius}
        showValue={props.showValue}
      />
    </Chart>
  )
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
