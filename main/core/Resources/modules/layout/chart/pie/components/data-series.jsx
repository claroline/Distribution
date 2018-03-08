import React from 'react'
import {PropTypes as T} from 'prop-types'
import {pie} from 'd3-shape'

import {Arc} from '#/main/core/layout/chart/pie/components/arc.jsx'

const DataSeries = props => {
  const pieInstance = pie().sort(null)
  const arcData = pieInstance(props.data)

  return (
    <g>
      {arcData.map((arc, index) => (
        <Arc
          key={index}
          color={props.colors[index]}
          innerRadius={props.innerRadius}
          outerRadius={props.outerRadius}
          startAngle={arc.startAngle}
          endAngle={arc.endAngle}
          value={arc.value}
          showValue={props.showValue}
        />
      ))}
    </g>
  )
}

DataSeries.propTypes = {
  data: T.array.isRequired,
  colors: T.arrayOf(T.string).isRequired,
  innerRadius: T.number.isRequired,
  outerRadius: T.number.isRequired,
  showValue: T.bool.isRequired
}

export {
  DataSeries
}