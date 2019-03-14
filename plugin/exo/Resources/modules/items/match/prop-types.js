import {PropTypes as T} from 'prop-types'


const MatchItem = {
  propTypes: {
    firstSet: T.arrayOf(T.shape({})),
    secondSet: T.arrayOf(T.shape({})),
    solutions: T.arrayOf(T.shape({}))
  },
  defaultProps: {
    firstSet: [],
    secondSet: [],
    solutions: []
  }
}

export {
  MatchItem
}
