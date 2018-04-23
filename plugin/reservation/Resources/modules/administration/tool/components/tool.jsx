import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {matchPath, withRouter} from '#/main/core/router'
import {
  PageActions,
  PageAction,
  PageHeader
} from '#/main/core/layout/page'
import {
  RoutedPageContainer,
  RoutedPageContent
} from '#/main/core/layout/router'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {actions} from '#/plugin/reservation/administration/resource/actions'
import {Resources} from '#/plugin/reservation/administration/resource/components/resources.jsx'
import {ResourceForm} from '#/plugin/reservation/administration/resource/components/resource-form.jsx'
import {MODAL_RESOURCE_TYPES} from '#/plugin/reservation/administration/resource-type/components/modal/resource-types-modal.jsx'

const ToolActions = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="resourceForm"
      target={(resource, isNew) => isNew ?
        ['apiv2_reservationresource_create'] :
        ['apiv2_reservationresource_update', {id: resource.id}]
      }
      opened={!!matchPath(props.location.pathname, {path: '/form'})}
      open={{
        type: 'link',
        icon: 'fa fa-plus',
        label: trans('add_resource', {}, 'reservation'),
        target: '/form'
      }}
      cancel={{
        type: 'link',
        target: '/',
        exact: true
      }}
    />
    {props.isAdmin &&
      <PageAction
        id="resources-types-list"
        type="callback"
        icon="fa fa-bars"
        label={trans('resource_types', {}, 'reservation')}
        action={() => props.showModal(MODAL_RESOURCE_TYPES, {})}
      />
    }
  </PageActions>

ToolActions.propTypes = {
  isAdmin: T.bool.isRequired,
  location: T.shape({
    pathname: T.string
  }).isRequired,
  showModal: T.func.isRequired
}

const ToolPageActions = withRouter(ToolActions)

const Tool = props =>
  <RoutedPageContainer
    id="tool-page-container"
  >
    <PageHeader
      title={trans('admin_resources_reservation', {}, 'tools')}
      key="tool-page-header"
    >
      <ToolPageActions {...props}/>
    </PageHeader>

    <RoutedPageContent
      key="tool-page-content"
      routes={[
        {
          path: '/',
          exact: true,
          component: Resources
        }, {
          path: '/form/:id?',
          component: ResourceForm,
          onEnter: (params) => props.openForm(params.id || null)
        }
      ]}
    />
  </RoutedPageContainer>

Tool.propTypes = {
  isAdmin: T.bool.isRequired,
  openForm: T.func.isRequired,
  showModal: T.func.isRequired
}

const ReservationTool = connect(
  (state) => ({
    isAdmin: state.isAdmin
  }),
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.openForm('resourceForm', id))
    },
    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    }
  })
)(Tool)

export {
  ReservationTool
}