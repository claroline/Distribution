import {PropTypes as T} from 'prop-types'

const Event = {
  propTypes: {
    id: T.string.isRequired,
    title: T.string,
    start: T.string,
    end: T.string,
    description: T.string,
    thumbnail: T.shape({
      url: T.string
    }),
    meta: T.shape({
      type: T.oneOf(['event', 'task']).isRequired
    }),
    display: T.shape({
      color: T.string
    }),
    permissions: T.shape({
      edit: T.bool
    })
  },
  defaultProps: {
    meta: {
      type: 'event'
    },
    permissions: {}
  }
}

export {
  Event
}
