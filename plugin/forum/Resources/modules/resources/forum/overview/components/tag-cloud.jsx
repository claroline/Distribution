import React from 'react'
import {PropTypes as T} from 'prop-types'
import {scaleLinear} from 'd3-scale'

import {CallbackButton} from '#/main/app/button/components/callback'


// tags is an object with keys=tag and values=count
const TagCloud = props => {

  const fontSizeConverter = scaleLinear()
    .range([props.minSize, props.maxSize])
    .domain([1, Math.max(...Object.values(props.tags))])

  return (
    <div className="tag-cloud-container">
      {Object.keys(props.tags).map(tag =>
        <CallbackButton
          key={tag}
          className="btn btn-link tag-cloud"
          callback={props.callback}
          style={{fontSize: fontSizeConverter(props.tags[tag], 1, 3)+'px'}}
        >
          {tag}
        </CallbackButton>
      )}
    </div>
  )
}


TagCloud.propTypes = {
  minSize: T.number.isRequired,
  maxSize: T.number.isRequired
  // tags: T.shape({})
}


export {
  TagCloud
}
