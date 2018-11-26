import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {actions} from '#/main/core/administration/template/store'
import {
  PageContainer,
  PageActions,
  PageAction,
  PageHeader
} from '#/main/core/layout/page'
import {RoutedPageContent} from '#/main/core/layout/router'
import {Templates} from '#/main/core/administration/template/components/templates'
import {Template} from '#/main/core/administration/template/components/template'

const Tool = (props) =>
  <PageContainer>
    <PageHeader
      title={trans('templates_management', {}, 'tools')}
    >
      <PageActions>
        <PageAction
          type={LINK_BUTTON}
          icon="fa fa-plus"
          label={trans('add_a_template')}
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
          component: Templates,
          exact: true
        }, {
          path: '/form/:id?',
          component: Template,
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

const TemplateTool = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.openForm('template', id))
    },
    resetForm() {
      dispatch(actions.resetForm('template'))
    }
  })
)(Tool)

export {
  TemplateTool
}