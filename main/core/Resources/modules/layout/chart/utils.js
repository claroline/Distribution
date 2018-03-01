import {max, min} from 'd3-array'
import {scaleLinear, scaleBand} from 'd3-scale'
import {
  AXIS_TYPE_X,
  AXIS_TYPE_Y
} from '#/main/core/layout/chart/enums'

const scaleAxis = (values, type, length = null, minMaxAsDomain = false) => {
  let scale = null
  switch (type) {
    case AXIS_TYPE_X:
      scale = scaleBand()
        .domain(values)
        .rangeRound([0, length])
        .paddingInner([0.2])
      break
    case AXIS_TYPE_Y: {
      let minValue = minMaxAsDomain ? min(values) : 0
      scale = scaleLinear().domain([minValue, max(values)]).range([length, 0])
      break
    }
  }

  return scale
}

export {
  scaleAxis
}