import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'

const TagCloudComponent = props =>
  <a href="#" key={Object.keys(props.tagsCount)} className="label label-primary">
    {/* <span style={style}>{Object.keys(props.tagsCount)}</span> */}
  </a>


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
