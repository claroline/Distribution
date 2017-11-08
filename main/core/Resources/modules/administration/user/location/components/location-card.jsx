import React from 'react'

const LocationCard = (row) => ({
  onClick: '#',
  poster: null,
  icon: 'fa fa-users',
  title: row.name,
  subtitle: row.name,
  contentText: '',
  flags: [],
  footer: <span>footer</span>,
  footerLong: <span>footerLong</span>
})

export {
  LocationCard
}
