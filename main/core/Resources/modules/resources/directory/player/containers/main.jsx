import React from 'react'
import {connect} from 'react-redux'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors as resourceSelectors} from '#/main/core/resource/store'
//import {actions as explorerActions} from '#/main/core/resource/explorer/store'

import {PlayerMain as PlayerMainComponent} from '#/main/core/resources/directory/player/components/main'
import {selectors} from '#/main/core/resources/directory/player/store'

const PlayerMain = connect(
  (state) => ({
    path: toolSelectors.path(state), // get path from tool to not get the current resource id
    id: resourceSelectors.id(state),
    listName: selectors.LIST_NAME,
    listConfiguration: selectors.listConfiguration(state)
  }),
  (dispatch) => ({
    /*addNodes(resourceNodes) {
      dispatch(explorerActions.addNodes(selectors.EXPLORER_NAME, resourceNodes))
    },

    updateNodes(resourceNodes) {
      dispatch(explorerActions.updateNodes(selectors.EXPLORER_NAME, resourceNodes))
    },

    deleteNodes(resourceNodes) {
      dispatch(explorerActions.deleteNodes(selectors.EXPLORER_NAME, resourceNodes))
    }*/
  })
)(PlayerMainComponent)

export {
  PlayerMain
}
