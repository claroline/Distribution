import {PropTypes as T} from 'prop-types'

import {WIKI_MODES} from '#/plugin/wiki/resources/wiki/constants'

const WikiType = {
  propTypes: {
    id: T.string.isRequired,
    mode: T.oneOf(
      Object.keys(WIKI_MODES)
    ).isRequired,
    displaySectionNumbers: T.bool
  }
}

export {
  WikiType
}