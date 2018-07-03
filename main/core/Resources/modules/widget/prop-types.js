import {PropTypes as T} from 'prop-types'

const Widget = {
  propTypes: {
    id: T.string.isRequired,
    name: T.string.isRequired,
    meta: T.shape({
      abstract: T.bool,
      parent: T.object, // another Widget
      context: T.arrayOf(T.string)
    }).isRequired,
    tags: T.arrayOf(T.string)
  }
}

const WidgetInstance = {
  propTypes: {
    id: T.string.isRequired,
    type: T.string.isRequired,
    // specific parameters of the content
    // depends on the `type`
    parameters: T.object
  },
  defaultProps: {

  }
}

const WidgetContainer = {
  propTypes: {
    id: T.string.isRequired,
    name: T.string,
    display: T.shape({
      layout: T.arrayOf(
        T.number // the ratio for each col
      ).isRequired,
      color: T.string,
      backgroundType: T.oneOf(['none', 'color', 'image']),
      background: T.string // either the color or the image url
    }),
    contents: T.arrayOf(T.shape(
      WidgetInstance.propTypes
    ))
  },
  defaultProps: {
    display: {
      layout: [1],
      color: '#333333',
      backgroundType: 'color',
      background: '#FFFFFF'
    },
    parameters: {},
    contents: []
  }
}

export {
  Widget,
  WidgetInstance,
  WidgetContainer
}
