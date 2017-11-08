import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'
import {LocationList} from '#/main/core/administration/user/location/components/location-list.jsx'

const LocationsActions = props =>
  <PageActions>
    <PageAction
      id="location-add"
      icon="fa fa-plus"
      title={t('add_location')}
      action="#/locations/add"
      primary={true}
    />
  </PageActions>

const Locations = props =>
  <DataList
    name="locations.list"
    definition={LocationList.definition}
    actions={[{
      icon: 'fa fa-fw fa-location-arrow',
      label: t('geolocate'),
      action: (rows) => props.geolocate(rows[0]),
      context: 'row'
    }]}
    card={LocationList.card}
  />

Locations.propTypes = {

}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    geolocate(location) {
      dispatch(actions.geolocate(location))
    }
  }
}

const ConnectedLocations = connect(mapStateToProps, mapDispatchToProps)(Locations)

export {
  LocationsActions,
  ConnectedLocations as Locations
}
