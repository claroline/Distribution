import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

const LocationTabActions = props =>
  <div>
    page actions
  </div>

const Locations = props =>
  <DataList
    name="locations"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: t('name'),
        displayed: true
      },
      {
        name: 'adress',
        type: 'string',
        label: t('adress'),
        renderer: (rowData) => getReadableAdress(rowData),
        displayed: true
      },
      {
        name: 'phone',
        type: 'string',
        label: t('phone'),
        displayed: true
      },
      {
        name: 'coordinates',
        type: 'string',
        label: t('coordinates'),
        displayed: true,
        renderer: (rowData) => getCoordinates(rowData)
      }
    ]}
    actions={[{
      icon: 'fa fa-fw fa-location-arrow',
      label: t('geolocate'),
      action: (rows) => alert('geolocate'),
      context: 'row'
    }]}
    card={(row) => ({
      onClick: '#',
      poster: null,
      icon: 'fa fa-users',
      title: row.name,
      subtitle: row.name,
      contentText: '',
      flags: [],
      footer: <span>footer</span>,
      footerLong: <span>footerLong</span>
    })}
  />

function getCoordinates(location) {
  if (location.latitude && location.longitude) {
      return location.latitude + ' - ' + location.longitude
  }
}

function getReadableAdress(location) {
  //this depends on the language I guess... but we don't always have every field either
  //basic display for now
    let str = ''
    let prepend = false

    if (location.street_number) {
      str += location.street_number
      prepend = true
    }

    if (location.street) {
      if (prepend) {
        str += ', '
      }
      str += location.street
      prepend = true
    }

    if (location.pc) {
      if (prepend) {
        str += ', '
      }
      str += location.pc
      prepend = true
    }

    if (location.town) {
      if (prepend) {
        str += ', '
      }
      str += location.town
      prepend = true
    }

    if (location.country) {
      if (prepend) {
        str += ', '
      }
      str += location.country
    }

    return str
}

Locations.propTypes = {

}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const LocationTab = connect(mapStateToProps, mapDispatchToProps)(Locations)

export {
  LocationTabActions,
  LocationTab
}
