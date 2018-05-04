import {PropTypes as T} from 'prop-types'

const BlogOptionsType = {
  propTypes: {
    authorizeComment: T.bool.isRequired,
    authorizeAnonymousComment: T.bool.isRequired,
    postPerPage: T.number.isRequired,
    autoPublishPost: T.bool.isRequired,
    autoPublishComment: T.bool.isRequired,
    displayTitle: T.bool.isRequired,
    bannerActivate: T.bool.isRequired,
    displayPostViewCounter: T.bool.isRequired,
    tagCloud: T.number.isRequired,
    listWidgetBlog: T.array,
    tagTopMode: T.bool.isRequired,
    postPerPage: T.number
  }
}

export {
  BlogOptionsType
}
