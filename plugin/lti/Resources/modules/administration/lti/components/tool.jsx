import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {makeId} from '#/main/core/scaffolding/id'
import {
  PageContainer,
  PageActions,
  PageAction,
  PageHeader
} from '#/main/core/layout/page'
import {
  RoutedPageContent
} from '#/main/core/layout/router'

import {actions} from '#/plugin/lti/administration/lti/store'
import {Apps} from '#/plugin/lti/administration/lti/components/apps'
import {App}  from '#/plugin/lti/administration/lti/components/app'

const Tool = props =>
  <PageContainer>
    <PageHeader
      title={trans('ujm_lti_resource', {}, 'resource')}
    >
      <PageActions>
        <PageAction
          type={LINK_BUTTON}
          icon="fa fa-plus"
          label={trans('add_lti_app', {}, 'lti')}
          target="/form"
          exact={true}
          primary={true}
        />
      </PageActions>
    </PageHeader>

    <RoutedPageContent
      routes={[
        {
          path: '/',
          component: Apps,
          exact: true
        }, {
          path: '/form/:id?',
          component: App,
          onEnter: (params) => props.openForm(params.id || null),
          onLeave: () => props.resetForm()
        }
      ]}
    />
  </PageContainer>

Tool.propTypes = {
  openForm: T.func.isRequired,
  resetForm: T.func.isRequired
}

const LtiTool = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      const defaultValue = {
        id: makeId()
      }
      dispatch(actions.open('app', id, defaultValue))
    },
    resetForm() {
      dispatch(actions.open('app', null, {}))
    }
  })
)(Tool)

export {
  LtiTool
}