import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

// todo add placeholder when empty

const SimpleWidgetEditorComponent = props =>
  <HtmlText>
    {props.content}
  </HtmlText>

SimpleWidgetEditorComponent.propTypes = {
  content: T.string
}

const SimpleWidgetEditor = connect(
  (state) => ({
    content: state.content
  })
)(SimpleWidgetEditorComponent)

export {
  SimpleWidgetEditor
}
