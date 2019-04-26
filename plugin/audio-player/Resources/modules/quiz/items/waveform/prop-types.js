import {PropTypes as T} from 'prop-types'

const Section = {
  propTypes: {
    id: T.string.isRequired,
    regionId: T.string,
    start: T.number.isRequired,
    end: T.number.isRequired,
    startTolerance: T.number.isRequired,
    endTolerance: T.number.isRequired,
    color: T.string
  }
}

const WaveformItem = {
  propTypes: {
    url: T.string,
    solutions: T.arrayOf(T.shape({
      section: T.shape(Section.propTypes),
      score: T.number,
      feedback: T.string
    }))
  },
  defaultProps: {
    url: null,
    solutions: []
  }
}

export {
  Section,
  WaveformItem
}
