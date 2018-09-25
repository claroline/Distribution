import {PropTypes as T} from 'prop-types'

const WalkthroughStep = {
  propTypes: {
    /**
     * A list of ui elements to highlight during the step.
     * NB. This MUST be a valid list of selectors (@see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
     */
    highlight: T.arrayOf(T.string),

    /**
     * The content of the step.
     */
    content: T.shape({
      icon: T.oneOfType([T.string, T.element]),
      title: T.string,
      message: T.string.isRequired,
      link: T.string
    }).isRequired,

    /**
     * The position of the content.
     * It permits to attach the popover to a specific ui element.
     * If none is provided, the popover will be displayed in the middle of the user screen.
     */
    position: T.shape({
      target: T.string.isRequired,
      placement: T.oneOf(['left', 'top', 'right', 'bottom']).isRequired
    }),

    actions: [

    ]
  },
  defaultProps: {

  }
}

const Walkthrough = {
  propTypes: {
    title: T.string.isRequired,
    description: T.string,
    difficulty: T.oneOf(['easy', 'intermediate', 'hard', 'expert']),
    scenario: T.arrayOf(T.shape(
      WalkthroughStep.propTypes
    )).isRequired,

  },
  defaultProps: {

  }
}

export {
  Walkthrough,
  WalkthroughStep
}
