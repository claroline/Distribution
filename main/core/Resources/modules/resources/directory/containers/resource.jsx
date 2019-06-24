import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {withReducer} from '#/main/app/store/components/withReducer'

import {selectors as explorerSelectors} from '#/main/core/resource/explorer/store'

import {DirectoryResource as DirectoryResourceComponent} from '#/main/core/resources/directory/components/resource'
import {selectors} from '#/main/core/resources/directory/store'

const DirectoryResource = withRouter(
  connect(
    (state) => ({
      //root: explorerSelectors.root(explorerSelectors.explorer(state, selectors.EXPLORER_NAME)),
      //current: explorerSelectors.currentNode(explorerSelectors.explorer(state, selectors.EXPLORER_NAME))
    })
  )(DirectoryResourceComponent)
)

export {
  DirectoryResource
}
