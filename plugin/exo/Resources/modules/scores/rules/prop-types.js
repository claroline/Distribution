import {PropTypes as T} from 'prop-types'

const Rule = {
  propTypes: {
    id: T.string.isRequired,
    type: T.string.isRequired,
    source: T.string.isRequired,
    count: T.number,
    countMin: T.number,
    countMax: T.number,
    points: T.number.isRequired,
    target: T.string.isRequired
  }
}

const ScoreRules = {
  propTypes: {
    noWrongChoice: T.bool,
    rules: T.arrayOf(
      Rule.propTypes
    ).isRequired
  },

  defaultProps: {
    noWrongChoice: true,
    rules: []
  }
}

export {
  ScoreRules
}
