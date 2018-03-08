import React from 'react'
import {PropTypes as T} from 'prop-types'

import { implementPropTypes } from '#/main/core/scaffolding/prop-types'
import {AxisChart as ChartTypes} from '#/main/core/layout/chart/prop-types'
import {Chart} from '#/main/core/layout/chart/components/chart.jsx'
import {Axis} from '#/main/core/layout/chart/components/axis.jsx'
import {scaleAxis} from '#/main/core/layout/chart/utils'
import {
  AXIS_TYPE_X,
  AXIS_TYPE_Y,
  DATA_SERIES,
  CHART_TYPES
} from '#/main/core/layout/chart/enums'

/**
 * Draws a Line or Bar chart (or any chart having axis)
 * data must be formed as a key value object collection
 * data : {
 *   key1: {xData: dataForXAxis, yData: dataForYAxis},
 *   key2: {xData: dataForXAxis, yData: dataForYAxis},
 *   ...
 * }
 */
const AxisChart = props => {
  const yValues = Object.keys(props.data).map(key => { return props.data[key].yData })
  const xValues = Object.keys(props.data).map(key => { return props.data[key].xData })

  const width = props.width - props.margin.left - props.margin.right
  const height = props.height - props.margin.top - props.margin.bottom

  const yScale = scaleAxis(yValues, AXIS_TYPE_Y, height, props.minMaxAsYDomain)
  const xScale = scaleAxis(xValues, AXIS_TYPE_X, width)

  return (
    <Chart
      width={props.width}
      height={props.height}
      margin={props.margin}
    >
      {React.createElement(DATA_SERIES[props.type], {
        data: props.data,
        height: height,
        yScale: yScale,
        xScale: xScale,
        xValues: xValues,
        yValues: yValues,
        color: props.color,
        altColor: props.altColor
      })}

      <Axis
        height={height}
        width={width}
        margin={props.margin}
        values={xValues}
        scale={xScale}
        type={AXIS_TYPE_X}
        label={props.xAxisLabel}
      />
      <Axis
        height={height}
        width={width}
        margin={props.margin}
        values={yValues}
        scale={yScale}
        type={AXIS_TYPE_Y}
        label={props.yAxisLabel}
        ticksAsValues={props.ticksAsYValues}
      />
    </Chart>
  )
}

implementPropTypes(AxisChart, ChartTypes, {
  data: T.object.isRequired,
  type: T.oneOf(CHART_TYPES).isRequired
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
  AxisChart
}
