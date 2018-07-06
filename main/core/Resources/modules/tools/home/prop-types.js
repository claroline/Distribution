import {PropTypes as T} from 'prop-types'

import {Widget} from '#/main/core/widget/prop-types'

const Tab = {
  propTypes: {
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string,
    icon: T.string,
    poster: T.shape({
      url: T.string
    }),
    position: T.number,
    type: T.oneOf(['workspace', 'desktop']),
    widgets: T.arrayOf(T.shape(
      Widget.propTypes
    ))
  },
  defaultProps: {
    icon: null,
    poster: [],
    widgets: []
  }
}

export {
  Tab
}
