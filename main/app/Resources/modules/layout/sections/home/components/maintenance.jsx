import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {PageSimple} from '#/main/app/page/components/simple'
import {selectors} from '#/main/app/layout/store'

const MaintenanceMessage = () =>
  <div>Maintenance</div>

const HomeMaintenance = props =>
  <PageSimple>
    {props.maintenanceMessage &&
      <div dangerouslySetInnerHTML={{__html: props.maintenanceMessage }}/>
    }
    {!props.maintenanceMessage &&
      <MaintenanceMessage/>
    }
  </PageSimple>

HomeMaintenance.propTypes = {
  maintenanceMessage: T.string
}

const ConnectedHomeMaintenance = connect(
  (state) => ({
    maintenanceMessage: selectors.maintenanceMessage(state)
  })
)(HomeMaintenance)

export {
  ConnectedHomeMaintenance as HomeMaintenance
}
