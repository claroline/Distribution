import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'

import {WorkspaceList} from '#/main/core/workspace/registered/components/workspace-list.jsx'
import {actions} from '#/main/core/workspace/registered/actions'
import {trans, transChoice} from '#/main/core/translation'

import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import '#/main/core/data/form/modals'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

const WorkspacesList = props =>
  <DataListContainer
    name="workspaces.list"
    fetch={{
      url: ['apiv2_workspace_displayable_list'],
      autoload: true
    }}
    definition={WorkspaceList.definition}
    primaryAction={WorkspaceList.open}
    card={WorkspaceList.card}
  />

WorkspacesList.propTypes = {
  register: T.func.isRequired,
  unregister: T.func.isRequired
}

const Workspaces = connect(
  null,
  () => ({

  })
)(WorkspacesList)

export {
  Workspaces
}
