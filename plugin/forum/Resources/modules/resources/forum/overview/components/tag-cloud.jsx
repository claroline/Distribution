import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {UrlButton} from '#/main/app/button/components/url'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'



const fontSizeConverter = (count, min, max) => {
  return Math.round((count - min) * (30 - 14) / (max - min) + 14)
}

// const counts = Object.values(props.tagsCount).map(count => count)
// const min = Math.min(...counts)
// const max = Math.max(...counts)
const fontSize = (count, min, max) => fontSizeConverter(count, min, max) +'px'


// tagsCount is an object with keys=tag and values=count
const TagCloudComponent = props =>

  <div>
    {Object.keys(props.tagsCount).map(tag =>
      <UrlButton
        type="link"
        key={tag}
        className="btn btn-link tag-cloud"
        target="/subjects"
        style={{fontSize: fontSize(props.tagsCount[tag], 1, 3)}}
      >
        {tag}
      </UrlButton>
    )}
  </div>





TagCloudComponent.propTypes = {
  // tagsCount: T.shape({})
}

const TagCloud = connect(
  (state) => ({
    tagsCount: select.tagsCount(state)
  })
)(TagCloudComponent)

export {
  TagCloud
}
