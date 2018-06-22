import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {url} from '#/main/app/api'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {constants} from '#/main/core/data/list/constants'

const ParametersTabActions = () =>
  <PageActions>
    <FormPageActionsContainer
      formName="parameters"
      opened={true}
      target={['apiv2_parameters_update']}
    />
  </PageActions>

const Parameters = (props) => {
  return(<FormContainer
    level={3}
    name="parameters"
    sections={[
      {
        icon: 'fa fa-fw fa-book',
        title: trans('display'),
        defaultOpened: true,
        fields: [
          {
            name: 'workspace.list.default_mode',
            label: trans('mode'),
            type: 'choice',
            options: {
              multiple: false,
              condensed: false,
              choices: {
                [constants.DISPLAY_LIST]: trans('list_display_list'),
                [constants.DISPLAY_LIST_SM]: trans('list_display_list_sm'),
                [constants.DISPLAY_TABLE]: trans('list_display_table'),
                [constants.DISPLAY_TABLE_SM]: trans('list_display_table_sm'),
                [constants.DISPLAY_TILES]: trans('list_display_tiles'),
                [constants.DISPLAY_TILES_SM]: trans('list_display_tiles_sm')
              }
            },
            displayed: true
          },
          {
            name: 'workspace.list.default_properties',
            label: trans('properties'),
            type: 'choice',
            options: {
              multiple: true,
              condensed: false,
              choices: {
                'name': trans('name'),
                'code': trans('code'),
                'meta.created': trans('creation_date'),
                'meta.personal': trans('personal_workspace'),
                'registration.selfRegistration': trans('public_registration')
              }
            },
            displayed: true
          }
        ]
      }
    ]}
  />)
}

Parameters.propTypes = {
  parameters: T.object.isRequired
}

const ParametersTab = connect(
  (state) => ({
    parameters: formSelect.data(formSelect.form(state, 'parameters'))
  })
)(Parameters)

export {
  ParametersTabActions,
  ParametersTab
}
