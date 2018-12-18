import React from 'react'
import {connect} from 'react-redux'
import {BadgeList} from '#/plugin/open-badge/tools/badges/badge/components/badge-list'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConstants} from '#/main/app/content/list/constants'

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
    display={{current: listConstants.DISPLAY_LIST_SM}}
  />

const MyBadges = connect(
  (state) => ({
    context: state.context
  }),
  null
)(MyBadgesList)

export {
  MyBadges
}
