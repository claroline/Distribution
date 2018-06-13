import {PropTypes as T} from 'prop-types'

import {WIKI_MODES} from '#/plugin/wiki/resources/wiki/constants'

const Wiki = {
  propTypes: {
    id: T.string.isRequired,
    mode: T.oneOf(
      Object.keys(WIKI_MODES)
    ).isRequired,
    displaySectionNumbers: T.bool
  }
}

const Section = {
  propTypes: {
    'num': T.arrayOf(T.number).isRequired,
    'displaySectionNumbers': T.bool.isRequired,
    'canEdit': T.bool.isRequired,
    'loggedUserId': T.string,
    'mode': T.string.isRequired,
    'section': T.object.isRequired,
    'toggleSectionVisibility': T.func,
    'editSection': T.func.isRequired,
    'addSection': T.func.isRequired,
    'currentEditSection': T.object
  }
}

export {
  Wiki,
  Section
}