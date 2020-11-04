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
    code: '',
    title: '',
    capacity: 10,
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
    code: '',
    title: '',
    quantity: 1,
  }
}

export {
  Room,
  Material
}
