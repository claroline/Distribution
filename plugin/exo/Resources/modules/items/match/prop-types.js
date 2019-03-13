import {PropTypes as T} from 'prop-types'


const ChoiceItem = {
  propTypes: {
    firstSet: T.arrayOf(T.shape()),
    secondSet: T.array(T.shape())
  },
  defaultProps: {
    firstSet: [],
    secondSet: []
  }
}

export {
  ChoiceItem
}
