import React from 'react'
import {PropTypes as T} from 'prop-types'

export const HtmlRenderer = props => <div dangerouslySetInnerHTML={{__html: props.html}}></div>

HtmlRenderer.propTypes = {
  html: T.string
}
