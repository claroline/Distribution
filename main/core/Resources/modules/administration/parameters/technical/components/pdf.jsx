import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

const PdfComponent = (props) =>
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
        title: trans('pdf'),
        defaultOpened: true,
        fields: [
          {
            name: 'pdf.active',
            type: 'boolean',
            label: trans('active'),
            required: true
          }
        ]
      }
    ]}
  />


PdfComponent.propTypes = {
}

const Pdf = connect(
  null,
  dispatch => ({ })
)(PdfComponent)

export {
  Pdf
}
