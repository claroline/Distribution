import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'
import {actions} from '#/main/core/administration/user/location/actions'

import {Route, Switch} from '#/main/core/router'

import {Location,  LocationActions}  from '#/main/core/administration/user/location/components/location.jsx'
import {Locations, LocationsActions} from '#/main/core/administration/user/location/components/locations.jsx'

const LocationTabActions = props =>
<Switch>
  <Route path="/locations" exact={true} component={LocationsActions} />
  <Route path="/locations/add" exact={true} component={LocationActions} />
</Switch>

const LocationTab = props =>
  <Switch>
    <Route
      path="/locations"
      exact={true}
      component={Locations}
    />

    <Route
      path="/locations/add"
      exact={true}
      component={Location}
      onEnter={() => props.openForm(null)}
    />

    <Route
      path="/locations/:id"
      component={Location}
      onEnter={(params) => props.openForm(params.id)}
    />
  </Switch>

function mapDispatchToProps(dispatch) {
  return {
    openForm(id = null) {
      dispatch(actions.open(id))
    }
  }
}

const ConnectedLocationTab = connect(null, mapDispatchToProps)(LocationTab)

export {
  LocationTabActions,
  ConnectedLocationTab as LocationTab
}
