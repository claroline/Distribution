import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {FormData} from '#/main/app/content/form/containers/data'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'
import {selectors} from '#/main/core/administration/parameters/appearance/store/selectors'

//todo add logo
const MainComponent = props =>
  <FormData
    name="parameters"
    target={['apiv2_parameters_update']}
    buttons={true}
    cancel={{
      type: LINK_BUTTON,
      target: '/main',
      exact: true
    }}
    sections={[
      {
        icon: 'fa fa-fw fa-user-plus',
        title: trans('main'),
        defaultOpened: true,
        fields: [
          {
            name: 'display.footer',
            type: 'string',
            label: trans('footer'),
            required: false
          },
          {
            name: 'display.footer_login',
            type: 'boolean',
            label: trans('footer_login'),
            required: false
          },
          {
            name: 'display.footer_workspaces',
            type: 'boolean',
            label: trans('footer_workspace'),
            required: false
          },
          {
            name: 'display.header_locale',
            type: 'boolean',
            label: trans('header_locale'),
            required: false
          },
          {
            name: 'display.name_active',
            type: 'boolean',
            label: trans('name_active'),
            required: false
          },
          {
            name: 'display.theme',
            type: 'choice',
            label: trans('theme'),
            required: true,
            options: {
              multiple: false,
              condensed: true,
              choices: props.themeChoices
            }
          }
        ]
      }
    ]}
  />


MainComponent.propTypes = {
  themeChoices: T.object.isRequired
}

const Main = connect(
  (state) => ({
    themeChoices: selectors.themeChoices(state)
  }),
  dispatch => ({ })
)(MainComponent)

export {
  Main
}
