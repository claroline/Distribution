import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text'

const Resource = props =>
  <ResourcePageContainer>
    { props.isHtml && <HtmlText>{props.content}</HtmlText>}
    { !props.isHtml && <div>{props.content}</div>}
  </ResourcePageContainer>

Resource.propTypes = {
  content: T.string.isRequired,
  isHtml: T.bool.isRequired
}

const ResourceContainer = connect(
  state => ({
    content: state.content,
    isHtml: state.isHtml
  })
)(Resource)

export {
  ResourceContainer as Resource
}
