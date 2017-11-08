import React from 'react'

import {t} from '#/main/core/translation'

import {LocationCard} from '#/main/core/administration/user/location/components/location-card.jsx'

const LocationList = {
  definition: [
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
      filterable: false,
      renderer: (rowData) => getCoordinates(rowData)
    }
  ],
  card: LocationCard
}


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

export {
  LocationList
}
