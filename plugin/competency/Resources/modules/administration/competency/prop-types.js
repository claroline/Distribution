import {PropTypes as T} from 'prop-types'

const Scale = {
  propTypes: {
    id: T.string,
    name: T.string,
    levels: T.arrayOf(T.shape({
      id: T.string,
      value: T.string
    }))
  }
}

const Competency = {
  propTypes: {
    id: T.string,
    name: T.string,
    description: T.string,
    parent: T.object,
    scale: T.shape(Scale.propTypes),
    meta: T.shape({
      resourceCount: T.number
    }),
    structure: T.shape({
      root: T.number,
      lvl: T.number,
      lft: T.number,
      rgt: T.number
    })
  }
}

export {
  Scale,
  Competency
}