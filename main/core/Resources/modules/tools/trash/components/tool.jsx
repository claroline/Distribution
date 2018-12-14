import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ResourceList} from '#/main/core/resource/data/components/resource-ResourceList'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {actions} from '#/main/core/tools/trash/store/actions'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {CALLBACK_BUTTON, LINK_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

const TrashToolComponent = props =>
  <ListData
    name="users.list"
    fetch={{
      url: ['apiv2_user_list_managed_organization'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_user_delete_bulk']
    }}
    primaryAction={ResourceList.open}
    actions={(rows) => [

    ]}
    definition={ResourceList.definition}
    card={ResourceList.card}
  />

TrashToolComponent.propTypes = {
  current: T.shape(
    ResourceNodeTypes.propTypes
  ),
  loading: T.bool.isRequired,
  addNodes: T.func.isRequired,
  updateNodes: T.func.isRequired,
  deleteNodes: T.func.isRequired
}

const TrashTool = connect(
  state => ({
    workspace: state.workspace
  }),
  dispatch => ({
    restore(resourceNodes) {
      dispatch(actions.restore(resourceNodes))
    },

    delete(resourceNodes) {
      dispatch(actions.delete(resourceNodes))
    }
  })
)(TrashToolComponent)

export {
  TrashTool
}
