import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

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
    fetch={{
      url: generateUrl('apiv2_location_list'),
      autoload: true
    }}
    delete={{
      url: generateUrl('apiv2_location_delete_bulk'),
    }}
    definition={LocationList.definition}
    actions={[{
      icon: 'fa fa-fw fa-map-marker',
      label: t('geolocate'),
      action: (rows) => props.geolocate(rows[0]),
      context: 'row' // todo should be available in selection mode too
    }]}
    card={LocationList.card}
  />

Locations.propTypes = {
  geolocate: T.func.isRequired
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
