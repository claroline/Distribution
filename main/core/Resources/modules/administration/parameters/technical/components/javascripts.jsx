import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

const JavascriptsComponent = () =>
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
        icon: 'fa fa-fw fa-file',
        title: trans('javascripts'),
        defaultOpened: true,
        fields: [{
          name: 'javascripts',
          label: trans('javascripts'),
          type: 'collection',
          options: {
            name: 'javascript',
            label: trans('javascripts'),
            type: 'file',
            displayed: true,
            multiple: true,
            placeholder: trans('no_javascript'),
            button: trans('add_javascript')
          }
        }]
      }
    ]}
  />


JavascriptsComponent.propTypes = {
}

const Javascripts = connect(
  null,
  () => ({ })
)(JavascriptsComponent)

export {
  Javascripts
}
