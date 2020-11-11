import {PropTypes as T} from 'prop-types'

const Room = {
  propTypes: {
    id: T.string,
    code: T.string,
    name: T.string,
    description: T.string,
    capacity: T.number,
  },
  defaultProps: {
    capacity: 10
  }
}

const Material = {
  propTypes: {
    id: T.string,
    code: T.string,
    name: T.string,
    description: T.string,
    quantity: T.number,
  },
  defaultProps: {
    quantity: 1
  }
}

export {
  Room,
  Material
}
