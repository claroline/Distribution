import {PropTypes as T} from 'prop-types'

const ProgressionItem = {
  propTypes: {
    id: T.string.isRequired,
    name: T.string.isRequired,
    level: T.number.isRequired,
    validated: T.bool,
    openingUrl: T.string
  }
}

export {
  ProgressionItem
}
