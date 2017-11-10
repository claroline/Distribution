import React from 'react'

const GroupCard = (row) => ({
  onClick: `#/groups/${props.id}`,
  icon: 'fa fa-users',
  title: row.name,
  subtitle: row.name
})

export {
  GroupCard
}
