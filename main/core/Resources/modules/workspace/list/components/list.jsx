import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {WorkspaceList} from '#/main/core/workspace/list/components/workspace-list.jsx'
import {actions} from '#/main/core/workspace/list/actions'
import {trans, transChoice} from '#/main/core/translation'

import {PageContainer, PageHeader,PageContent} from '#/main/core/layout/page/index'

const WorkspacesList = props =>
  <PageContainer>
    <PageHeader>
    </PageHeader>
    <PageContent>
      <DataListContainer
        name="workspaces"
        fetch={{
          url: ['apiv2_workspace_displayable_list'],
          autoload: true
        }}
        definition={WorkspaceList.definition}
        primaryAction={WorkspaceList.open}
        card={WorkspaceList.card}
        actions={(rows) => [
          {
            type: 'callback',
            icon: 'fa fa-fw fa-book',
            label: trans('register'),
            displayed: rows[0].registration.selfRegistration && !rows[0].permissions['open'],
            scope: ['object'],
            callback: () => props.register(),
            confirm: {
              title: trans('unregister_groups'),
              message: trans('unregister_groups')
            }
          },
          {
            type: 'callback',
            icon: 'fa fa-fw fa-book',
            label: trans('unregister'),
            dangerous: true,
            displayed: rows[0].registration.selfUnregistration && rows[0].permissions['open'],
            scope: ['object'],
            callback: () => props.unregister(),
            confirm: {
              title: trans('unregister_groups'),
              message: trans('unregister_groups')
            }
          }
        ]}
      />
    </PageContent>
  </PageContainer>

WorkspacesList.propTypes = {
  register: T.func.isRequired,
  unregister: T.func.isRequired
}

const Workspaces = connect(
  null,
  dispatch => ({
    register(workspaces) {
      dispatch(actions.register(workspaces))
    },
    unregister(workspaces) {
      dispatch(actions.unregister(workspaces))
    }
  })
)(WorkspacesList)

export {
  Workspaces
}
