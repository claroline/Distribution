import React from 'react'
import {connect} from 'react-redux'
import {BadgeList} from '#/plugin/open-badge/workspace/badges/components/badge-list'
import {ListData} from '#/main/app/content/list/containers/data'

// todo : restore custom actions the same way resource actions are implemented
const BadgesList = () =>
  <ListData
    name="badges.list"
    fetch={{
      url: ['apiv2_badge-class_list'],
      autoload: true
    }}
    definition={BadgeList.definition}

    primaryAction={BadgeList.open}
    actions={() => []}
    card={BadgeList.card}
  />

const Badges = connect(
  null,
  null
)(BadgesList)

export {
  Badges
}
