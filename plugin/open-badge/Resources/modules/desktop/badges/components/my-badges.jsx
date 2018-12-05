import React from 'react'
import {connect} from 'react-redux'
import {BadgeList} from '#/plugin/open-badge/desktop/badges/components/badge-list'
import {ListData} from '#/main/app/content/list/containers/data'

// todo : restore custom actions the same way resource actions are implemented
const MyBadgesList = () =>
  <ListData
    name="badges.mine"
    fetch={{
      url: ['apiv2_badge-class_current_user_list'],
      autoload: true
    }}
    definition={BadgeList.definition}

    primaryAction={BadgeList.open}
    actions={() => []}
    card={BadgeList.card}
  />

const MyBadges = connect(
  null,
  null
)(MyBadgesList)

export {
  MyBadges
}
