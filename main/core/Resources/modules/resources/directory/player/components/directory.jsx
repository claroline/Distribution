import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ResourceExplorer} from '#/main/core/resource/explorer/containers/explorer'
import {selectors} from '#/main/core/resources/directory/player/store'

const DirectoryPlayer = () =>
  <ResourceExplorer
    name={selectors.EXPLORER_NAME}
    primaryAction={() => true}
  />

DirectoryPlayer.propTypes = {

}

export {
  DirectoryPlayer
}
