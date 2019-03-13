import {PropTypes as T} from 'prop-types'


const WordsItem = {
  propTypes: {
    solutions: T.arrayOf(T.shape({}))
  },
  defaultProps: {
    solutions: []
  }
}

export {
  WordsItem
}
