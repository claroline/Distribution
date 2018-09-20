import {PropTypes as T} from 'prop-types'

const WalkthroughStep = {
  propTypes: {
    /**
     * A list of HTML selectors to highlight during the step.
     */
    highlight: T.arrayOf(T.string),
    content: T.shape({
      title: T.string,
      message: T.string.isRequired
    }).isRequired,
    position: T.shape({
      target: T.string.isRequired,
      placement: T.oneOf(['left', 'top', 'right', 'bottom']).isRequired
    })
  },
  defaultProps: {

  }
}

export {
  WalkthroughStep
}
