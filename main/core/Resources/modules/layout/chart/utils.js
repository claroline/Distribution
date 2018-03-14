import {max, min, extent} from 'd3-array'
import {scaleLinear, scaleBand, scaleTime} from 'd3-scale'
import {isEmpty, zipWith} from 'lodash'
import {apiToDateObject, getApiFormat, isValidDate} from '#/main/core/scaffolding/date'
import {
  AXIS_TYPE_X,
  AXIS_TYPE_Y,
  DATE_DATA_TYPE,
  NUMBER_DATA_TYPE,
  STRING_DATA_TYPE
} from '#/main/core/layout/chart/enums'

const formatValue = (value, type) => {
  switch (type) {
    case DATE_DATA_TYPE:
      return apiToDateObject(value)
    default:
      value = value.toString()
      return value.length > 23 ? `${value.substring(0, 20)}...` : value
  }
}

const generateDataObject = (xVal = [], xType = STRING_DATA_TYPE, yVal = [], yType = NUMBER_DATA_TYPE) => ({
  x: {
    values: xVal,
    type: xType
  },
  y: {
    values: yVal,
    type: yType
  },
  pairs: zipWith(xVal, yVal, (x, y) => ({x, y}))
})

/**
 * @param data
 * data must be formed as a key value object collection
 * data : {
 *   key1: {xData: dataForXAxis, yData: dataForYAxis},
 *   key2: {xData: dataForXAxis, yData: dataForYAxis},
 *   ...
 * }
 *
 * @return {object} - returns a formated data object:
 * {
 *  x:{values:[x1, x2, ...], type:String|Date},
 *  y:{values:[y1, y2, ...], type: Number},
 *  pairs:[{x:x1, y:y1}, {x:x2, y:y2}, ...]
 * }
 */
const formatData = (data) => {
  //Find x data type (date, string, number)
  if (isEmpty(data)) {
    return generateDataObject()
  }
  let xVal = data[Object.keys(data)[0]].xData
  let xType = STRING_DATA_TYPE
  // If x is date or number
  if (isValidDate(xVal, getApiFormat())) {
    xType = DATE_DATA_TYPE
  }
  
  let xValues = Object.keys(data).map(key => { return formatValue(data[key].xData, xType) })
  // y values always numbers
  let yValues = Object.keys(data).map(key => { return parseFloat(data[key].yData) })
  
  return generateDataObject(xValues, xType, yValues)
}

/**
 * Performs axis scaling depending on dataType
 *
 * @param values
 * @param type
 * @param dataType
 * @param length
 * @param minMaxAsDomain
 * @return {func} - the scale function
 */
const scaleAxis = (values, type, dataType, length = null, minMaxAsDomain = false) => {
  let scale = null
  switch (dataType) {
    case STRING_DATA_TYPE:
      scale = scaleBand()
        .domain(values)
        .rangeRound([0, length])
        .paddingInner([0.2])
      break
    case NUMBER_DATA_TYPE: {
      let minValue = minMaxAsDomain ? min(values) : 0
      scale = scaleLinear().domain([minValue, max(values)])
      break
    }
    case DATE_DATA_TYPE:
      scale = scaleTime().domain(extent(values))
      break
  }
  
  if (type !== STRING_DATA_TYPE) {
    switch (type) {
      case AXIS_TYPE_X:
        scale.range([0, length])
        break
      case AXIS_TYPE_Y:
        scale.range([length, 0])
    }
  }

  return scale
}

export {
  scaleAxis,
  formatData
}