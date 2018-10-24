import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

const I18nComponent = (props) =>
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
        title: trans('i18n'),
        defaultOpened: true,
        fields: [
          {
            name: 'locales.available',
            type: 'string',
            label: trans('languages'),
            required: false
          }
        ]
      }
    ]}
  />


I18nComponent.propTypes = {
}

const I18n = connect(
  null,
  dispatch => ({ })
)(I18nComponent)

export {
  I18n
}
