import React from 'react'

const UserCard = (row) => ({
  onClick: '#',
  poster: null,
  icon: 'fa fa-user',
  title: row.username,
  subtitle: row.firstName + ' ' + row.lastName,
  contentText: '',
  flags: [],
  footer: <span>footer</span>,
  footerLong: <span>footerLong</span>
})

export {
  UserCard
}
