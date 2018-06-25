import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {MODAL_ALERT} from '#/main/app/modals/alert'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {WorkspaceList} from '#/main/core/workspace/list/components/workspace-list.jsx'
import {actions} from '#/main/core/workspace/list/actions'
import {trans, transChoice} from '#/main/core/translation'
import {constants as listConst} from '#/main/core/data/list/constants'

import {PageContainer, PageHeader,PageContent} from '#/main/core/layout/page/index'

const WorkspacesList = props => {
  const definition = WorkspaceList.definition
  const defaultProps = props.parameters.workspace.list.default_properties

  definition.forEach(prop => {
    prop.displayed = defaultProps.indexOf(prop.name) > -1
  })

  return(
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
          definition={definition}
          primaryAction={WorkspaceList.open}
          card={WorkspaceList.card}
          display={{
            current: props.parameters.workspace.list.default_mode,
            available: Object.keys(listConst.DISPLAY_MODES)
          }}
          actions={(rows) => [
            {
              type: 'callback',
              icon: 'fa fa-fw fa-book',
              label: trans('register'),
              displayed: rows[0].registration.selfRegistration && !rows[0].permissions['open'] && !rows[0].registration.waitingForRegistration,
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
              displayed: rows[0].registration.selfUnregistration && rows[0].permissions['open'],
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
  )}

WorkspacesList.propTypes = {
  register: T.func.isRequired,
  unregister: T.func.isRequired,
  url: T.string.isRequired
}

const Workspaces = connect(
  state => ({
    url: state.url,
    parameters: state.parameters
  }),
  dispatch => ({
    register(workspace) {
      dispatch(actions.register(workspace))

      if (workspace.registration.validation) {
        dispatch(modalActions.showModal(MODAL_ALERT, {
          title: trans('register')
        }))
      }
    },
    unregister(workspace) {
      dispatch(actions.unregister(workspace))
    }
  })
)(WorkspacesList)

export {
  Workspaces
}
