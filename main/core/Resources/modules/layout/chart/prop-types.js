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
    minMaxAsYDomain:T.bool,
    color: T.string,
    altColor: T.string
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
    minMaxAsYDomain: false,
    color: '#337ab7',
    altColor: 'brown'
  })
}

const DataSeries = {
  propTypes: {
    data: T.object.isRequired,
    yScale: T.func.isRequired,
    xScale: T.func.isRequired,
    xValues: T.array.isRequired,
    yValues: T.array.isRequired,
    height: T.number.isRequired,
    color: T.string.isRequired,
    altColor: T.string.isRequired
  },
  defaultProps: {
    color: '#337ab7',
    altColor: 'brown'
  }
}

export {
  Chart,
  AxisChart,
  DataSeries
}