import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {ResourceExplorer} from '#/main/core/resource/components/explorer'

const DirectoryPlayer = () =>
  <ResourceExplorer
    primaryAction={(resourceNode) => true}
  />

DirectoryPlayer.propTypes = {

}

export {
  DirectoryPlayer
}
