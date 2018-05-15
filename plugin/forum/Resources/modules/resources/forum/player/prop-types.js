import {PropTypes as T} from 'prop-types'

import {User as UserType} from '#/main/core/user/prop-types'

const Subject = {
  propTypes: {
    id: T.string,
    forum: T.shape({
      id: T.string.isRequired
    }),
    content: T.string,
    title: T.string,
    meta: T.shape({
      views: T.number,
      messages: T.number.isRequired,
      creator: T.shape(UserType.propTypes),
      created: T.string.isRequired,
      updated: T.string.isRequired,
      sticky: T.bool.isRequired
    }),
    restrictions: T.shae({})
  },
  defaultProps: {

  }
}



export {
  Subject
}
