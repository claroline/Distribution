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
          url: [props.url],
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
            //displayed: rows[0].registration.selfRegistration && !rows[0].permissions['open'],
            scope: ['object'],
            callback: () => props.register(rows[0]),
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
            //  displayed: rows[0].registration.selfUnregistration && rows[0].permissions['open'],
            scope: ['object'],
            callback: () => props.unregister(rows[0]),
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
  unregister: T.func.isRequired,
  url: T.string.isRequired
}

const Workspaces = connect(
  state => ({
    url: state.url
  }),
  dispatch => ({
    register(workspace) {
      dispatch(actions.register(workspace))
    },
    unregister(workspace) {
      dispatch(actions.unregister(workspace))
    }
  })
)(WorkspacesList)

export {
  Workspaces
}
