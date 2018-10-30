import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {FormData} from '#/main/app/content/form/containers/data'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'

//display
/**
'footer' => $parameters['footer'],
'logo' => $parameters['logo'],
'theme' => $parameters['theme'],
'home_menu' => $parameters['home_menu'],
'footer_login' => $parameters['footer_login'],
'footer_workspaces' => $parameters['footer_workspaces'],
'header_locale' => $parameters['header_locale'],
'resource_icon_set' => $parameters['resource_icon_set'],
'name' => $parameters['name'],
'name_active' => $parameters['name_active'],
*/

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

        ]
      }
    ]}
  />


MainComponent.propTypes = {
}

const Main = connect(
  null,
  dispatch => ({ })
)(MainComponent)

export {
  Main
}
