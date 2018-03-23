import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'


import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'


const Actions = () =>
  <PageActions>
    <FormPageActionsContainer
      formName="parameters"
      target={(workspace) => ['apiv2_workspace_update', {id: workspace.id}]}
      opened={true}
      cancel={{

      }}
    />
  </PageActions>

Actions.propTypes = {
  location: T.shape({
    pathname: T.string
  }).isRequired
}

const Parameters = () => {
  return (
    <div>
      <FormContainer
        level={3}
        name="parameters"
        sections={[
          {
            id: 'general',
            title: t('general'),
            primary: true,
            fields: [
              {
                name: 'name',
                type: 'string',
                label: t('name'),
                required: true
              },
              {
                name: 'code',
                type: 'string',
                label: t('code'),
                required: true
              }
            ]
          },
          {
            id: 'registration',
            title: t('registration'),
            primary: true,
            fields: [
              {
                name: 'registration.validation',
                type: 'boolean',
                label: t('registration_validation')
              },
              {
                name: 'registration.selfRegistration',
                type: 'boolean',
                label: t('public_registration')
              },
              {
                name: 'registration.selfUnregistration',
                type: 'boolean',
                label: t('public_unregistration')
              }
            ]
          },
          {
            id: 'display',
            title: t('display'),
            fields: [
              {
                name: 'display.displayable',
                type: 'boolean',
                label: t('displayable_in_workspace_list')
              }
            ]
          }
        ]}
      />
    </div>
  )
}

Parameters.propTypes = {
  workspace: T.shape({
  }).isRequired
}

const ConnectedParameters = connect(
  state => ({
    workspace: formSelect.data(formSelect.form(state, 'parameters'))
  }),
  null
)(Parameters)

export {
  ConnectedParameters as ParametersTab,
  Actions as ParametersActions
}
