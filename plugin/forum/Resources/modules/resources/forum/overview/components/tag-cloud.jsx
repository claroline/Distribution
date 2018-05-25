import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {UrlButton} from '#/main/app/button/components/url'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'

const TagCloudComponent = props =>
  <div>
    {console.log(props.tagsCount)}
    {[props.tagsCount].map(tag =>
      <div key={tag}>tag</div>
    )}
    <UrlButton
      type="link"
      key={Object.keys(props.tagsCount)}
      className="btn btn-link tag-cloud"
      target="/subjects"
    >
      {Object.keys(props.tagsCount)}
      {/* <span style={style}>{Object.keys(props.tagsCount)}</span> */}
    </UrlButton>
  </div>



TagCloudComponent.propTypes = {
  forum: T.shape(ForumType.propTypes)
}

const TagCloud = connect(
  (state) => ({
    tagsCount: select.tagsCount(state)
  })
)(TagCloudComponent)

export {
  TagCloud
}
