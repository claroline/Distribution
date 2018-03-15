import React from 'react'

import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {WorkspaceList} from '#/main/core/administration/workspace/workspace/components/workspace-list.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

/**
 * @constructor
 */
 const Workspace = props =>
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
   />

export {
  Workspace
}
