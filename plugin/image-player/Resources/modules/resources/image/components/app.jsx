import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {tex} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {Resource as ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

const Image = props =>
    <ResourceContainer customActions={[]}>
        <img src={generateUrl('claro_image', {node: props.resourceNodeId})}/>
    </ResourceContainer>

Image.propTypes = {
    image: T.shape({
        id: T.string.isRequired,
        hashName: T.string.isRequired
    }).isRequired

}

function mapStateToProps(state) {
  return {
      resourceNodeId: state.resourceNode.id
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedImage = connect(mapStateToProps, mapDispatchToProps)(Image)

export {ConnectedImage as Image}