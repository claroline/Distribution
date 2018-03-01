import {PropTypes as T} from 'prop-types'

const Chart = {
  propTypes: {
    width: T.number,
    height: T.number,
    margin: T.shape({
      top: T.number,
      bottom: T.number,
      left: T.number,
      right: T.number
    }).isRequired
  },
  defaultProps: {
    width: 400,
    height: 400,
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 30
    }
  }
}

const AxisChart = {
  propTypes: Object.assign({}, Chart.propTypes, {
    xAxisLabel: T.shape({
      show: T.bool.isRequired,
      text: T.string.isRequired
    }),
    yAxisLabel: T.shape({
      show: T.bool.isRequired,
      text: T.string.isRequired
    }),
    ticksAsYValues: T.bool,
    minMaxAsYDomain:T.bool
  }),
  defaultProps: Object.assign({}, Chart.defaultProps, {
    xAxisLabel: T.shape({
      show: false,
      text: 'X Axis DATA'
    }),
    yAxisLabel: T.shape({
      show: false,
      text: 'Y Axis DATA'
    }),
    ticksAsYValues: false,
    minMaxAsYDomain: false
  })
}

export {
  Chart,
  AxisChart
}