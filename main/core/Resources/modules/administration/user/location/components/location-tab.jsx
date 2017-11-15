import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

import {actions} from '#/main/core/administration/user/location/actions'
import {Location,  LocationActions}  from '#/main/core/administration/user/location/components/location.jsx'
import {Locations, LocationsActions} from '#/main/core/administration/user/location/components/locations.jsx'

const LocationTabActions = props =>
  <Routes
    routes={[
      {
        path: '/locations',
        exact: true,
        component: LocationsActions
      }, {
        path: '/locations/add',
        exact: true,
        component: LocationActions
      }, {
        path: '/locations/:id',
        exact: true,
        component: LocationActions
      }
    ]}
  >
  </Routes>

const LocationTab = props =>
  <Routes
    routes={[
      {
        path: '/locations',
        exact: true,
        component: Locations
      }, {
        path: '/locations/add',
        exact: true,
        component: Location,
        onEnter: () => props.openForm(null)
      }, {
        path: '/locations/:id',
        exact: true,
        component: Location,
        onEnter: (params) => props.openForm('locations.current', params.id)
      }
    ]}
  />

LocationTab.propTypes = {
  openForm: T.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return {
    openForm: (formName, id = null) => dispatch(actions.open(formName, id))
  }
}

const ConnectedLocationTab = connect(null, mapDispatchToProps)(LocationTab)

export {
  LocationTabActions,
  ConnectedLocationTab as LocationTab
}
