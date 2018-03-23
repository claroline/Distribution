import {PropTypes as T} from 'prop-types'

const Message = {
  propTypes: {
    id: T.string,
    title: T.string,
    content: T.string,
    workspace: T.shape({
      uuid: T.string.isRequired
    })
  }
}

export {
  Message
}