import React from 'react'
import {line} from 'd3-shape'
import {implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {DataSeries as DataSeriesTypes} from '#/main/core/layout/chart/prop-types'
import {Path} from '#/main/core/layout/chart/line/components/path.jsx'

/**
 * Represents data on a Bar chart.
 */
const DataSeries = props => {
  const d = line()
    .x(e => props.xScale(props.xValues(e)))
    .y(e => props.yScale(props.yValues(e)))

  return (
    <g>
      <Path
        strokeColor={props.color}
        strokeWidth={2}
        d={d}
      />
    </g>
  )
}

implementPropTypes(DataSeries, DataSeriesTypes, {}, {})

export {
  DataSeries
}
