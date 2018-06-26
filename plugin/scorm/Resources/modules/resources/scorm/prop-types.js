import {PropTypes as T} from 'prop-types'

const Sco = {
  propTypes: {
    id: T.string.isRequired,
    scorm: T.shape({
      id: T.string
    }),
    parent: T.shape({
      id: T.string
    }),
    children: T.array,
    data: T.shape({
      entryUrl: T.string,
      identifier: T.string,
      title: T.string,
      visible: T.boolean,
      parameters: T.string,
      launchData: T.string,
      maxTimeAllowed: T.string,
      timeLimitAction: T.string,
      block: T.boolean,
      scoreToPassInt: T.number,
      scoreToPassDecimal: T.number,
      scoreToPass: T.number,
      completionThreshold: T.number,
      prerequisites: T.string
    })
  }
}

const Scorm = {
  propTypes: {
    id: T.string.isRequired,
    version: T.string.isRequired,
    hashName: T.string.isRequired,
    scos: T.arrayOf(T.shape(Sco.propTypes))
  }
}

export {
  Sco,
  Scorm
}