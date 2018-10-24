import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

const PortalComponent = (props) =>
  <div>
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
          title: trans('portal'),
          defaultOpened: true,
          fields: [
            {
              name: 'portal.enabled_resources',
              type: 'string',
              label: trans('enabled_resources'),
              required: false
            }
          ]
        }
      ]}
    />
  </div>


PortalComponent.propTypes = {
}

const Portal = connect(
  null,
  dispatch => ({ })
)(PortalComponent)

export {
  Portal
}
