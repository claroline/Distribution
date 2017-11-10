import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {actions} from '#/main/core/administration/user/location/actions'
import {LocationList} from '#/main/core/administration/user/location/components/location-list.jsx'

/**
 * Locations list actions.
 *
 * @constructor
 */
const LocationsActions = () =>
  <PageActions>
    <PageAction
      id="location-add"
      icon="fa fa-plus"
      title={t('add_location')}
      action="#/locations/add"
      primary={true}
    />
  </PageActions>

/**
 * Locations list.
 *
 * @param props
 * @constructor
 */
const Locations = props =>
  <DataList
    name="locations.list"
    definition={LocationList.definition}
    actions={[{
      icon: 'fa fa-fw fa-map-marker',
      label: t('geotag'),
      action: (rows) => props.geolocate(rows[0]),
      context: 'row'
    }]}
    card={LocationList.card}
  />

Locations.propTypes = {
  geotag: T.func.isRequired
}

const ConnectedLocations = connect(
  null,
  (dispatch) => ({
    geolocate: (location) => dispatch(actions.geolocate(location))
  })
)(Locations)

export {
  LocationsActions,
  ConnectedLocations as Locations
}
