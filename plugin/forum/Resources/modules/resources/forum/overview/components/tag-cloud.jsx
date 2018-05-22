import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'

const TagCloudComponent = props =>
  <div>
    {props.tagsCount.map(tag => {
      console.log(tag)
    }

      // <a href="#" key={tag} className="label label-primary"><span className="fa fa-fw fa-tag" />{tag}</a>
    )}
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
