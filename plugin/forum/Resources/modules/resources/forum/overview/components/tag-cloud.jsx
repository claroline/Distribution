import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'

const TagCloudComponent = props =>
  <div>
    {props.forum.meta.tags.reduce((obj, tag) => {
      if (!obj[tag]) {
        obj[tag] = 0
      }
      obj[tag]++
      console.log(obj)
      return obj
    }, [])

    }
  </div>

{/* <a href="#" key={tag} className="label label-primary"><span className="fa fa-fw fa-tag" />{tag}</a> */}

TagCloudComponent.propTypes = {
  forum: T.shape(ForumType.propTypes)
}

const TagCloud = connect(
  (state) => ({
    forum: select.forum(state),
    messages: select.messages(state)
  })
)(TagCloudComponent)

export {
  TagCloud
}
