import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {PageSimple} from '#/main/app/page/components/simple'
import {selectors} from '#/main/app/layout/store'

const HomeMaintenance = props =>
  <PageSimple>
    <div dangerouslySetInnerHTML={{__html: props.maintenanceMessage }}/>
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
