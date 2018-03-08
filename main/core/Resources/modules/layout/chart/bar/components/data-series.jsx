import React from 'react'
import { implementPropTypes } from '#/main/core/scaffolding/prop-types'
import {DataSeries as DataSeriesTypes} from '#/main/core/layout/chart/prop-types'

import {Bar} from '#/main/core/layout/chart/bar/components/bar.jsx'

/**
 * Represents data on a Bar chart.
 */
const DataSeries = props => {
  const hasNegativeValues = Object.keys(props.data).some(key => parseFloat(props.data[key].yData) < 0)

  return (
    <g>
      {Object.keys(props.data).map((key, i) => {
        const isNegativeValue = parseFloat(props.data[key].yData) < 0
        return (
          <Bar
            key={i}
            height={isNegativeValue ? 0 : props.yScale(props.data[key].yData)}
            width={props.xScale.bandwidth()}
            offsetX={props.xScale(props.data[key].xData)}
            offsetY={isNegativeValue ? props.height / 2 : 0}
            maxHeight={hasNegativeValues ? props.height / 2 : props.height}
            color={isNegativeValue ? props.altColor : props.color}
          />
        )
      })}
    </g>
  )
}

implementPropTypes(DataSeries, DataSeriesTypes, {}, {})

export {
  DataSeries
}
