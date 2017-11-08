import React from 'react'

const RoleCard = (row) => ({
  onClick: '#',
  poster: null,
  icon: 'fa fa-id-badge',
  title: row.name,
  subtitle: row.name,
  contentText: '',
  flags: [],
  footer: <span>footer</span>,
  footerLong: <span>footerLong</span>
})

export {
  RoleCard
}
