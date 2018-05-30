import React from 'react'
import {PropTypes as T} from 'prop-types'
import {scaleLinear} from 'd3-scale'

import {UrlButton} from '#/main/app/button/components/url'


// tags is an object with keys=tag and values=count
const TagCloud = props => {

  const fontSizeConverter = scaleLinear()
    .range([props.minSize, props.maxSize])
    .domain([1, Math.max(...Object.values(props.tags))])

  return (
    <div className="tag-cloud-container">
      {Object.keys(props.tags).map(tag =>
        <UrlButton
          type="link"
          key={tag}
          className="btn btn-link tag-cloud"
          target="/subjects"
          style={{fontSize: fontSizeConverter(props.tags[tag], 1, 3)+'px'}}
        >
          {tag}
        </UrlButton>
      )}
    </div>
  )
}




TagCloud.propTypes = {

}


export {
  TagCloud
}
