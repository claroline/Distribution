import React from 'react'
import {connect} from 'react-redux'



import {BadgeList} from '#/plugin/open-badge/administration/badges/components/badge-list'
import {ListData} from '#/main/app/content/list/containers/data'

import {actions}    from '#/plugin/open-badge/administration/badges/actions'

// todo : restore custom actions the same way resource actions are implemented
const BadgesList = props =>
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
