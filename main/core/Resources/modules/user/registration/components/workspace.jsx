import React from 'react'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {WorkspaceList} from '#/main/core/administration/workspace/workspace/components/workspace-list.jsx'

/**
 * @constructor
 */
const Workspace = () =>
  <DataListContainer
    name="workspaces"
    open={WorkspaceList.open}
    fetch={{
      url: ['apiv2_workspace_list'],
      autoload: true
    }}
    definition={WorkspaceList.definition}
    actions={[]}
    card={WorkspaceList.card}
    selection={[23]}
  />

export {
  Workspace
}
