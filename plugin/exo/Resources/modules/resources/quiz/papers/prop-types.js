import {PropTypes as T} from 'prop-types'

const Paper = {
  propTypes: {
    id: T.string.isRequired,
    number: T.number.isRequired,
    startDate: T.string.isRequired,
    endDate: T.string,
    user: T.shape({
      // TODO : user type
    }),
    score: T.number,
    finished: T.bool.isRequired,

    // not available in minimal mode (aka in list)
    structure: T.object,
    answers: T.array
  },

  defaultProps: {
    finished: false,
    answers: []
  }
}

export {
  Paper
}