import React from 'react'
import {connect} from 'react-redux'
import {BadgeList} from '#/plugin/open-badge/workspace/badges/components/badge-list'
import {ListData} from '#/main/app/content/list/containers/data'

// todo : restore custom actions the same way resource actions are implemented
const BadgesList = props =>
  <ListData
    name="badges.list"
    fetch={{
      url: ['apiv2_badge-class_workspace_badge_list', {workspace: props.workspace.uuid}],
      autoload: true
    }}
    definition={BadgeList.definition}

    primaryAction={BadgeList.open}
    actions={() => []}
    card={BadgeList.card}
  />

const Badges = connect(
  (state) => ({
    workspace: state.workspace
  }),
  null
)(BadgesList)

export {
  Badges
}
