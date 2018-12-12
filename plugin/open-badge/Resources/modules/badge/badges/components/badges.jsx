import React from 'react'
import {connect} from 'react-redux'
import {BadgeList} from '#/plugin/open-badge/badge/badges/components/badge-list'
import {ListData} from '#/main/app/content/list/containers/data'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'

// todo : restore custom actions the same way resource actions are implemented
const BadgesList = props =>
  <ListData
    name="badges.list"
    fetch={{
      url: props.context === 'workspace' ? ['apiv2_badge-class_workspace_badge_list', {workspace: props.workspace.uuid}]: ['apiv2_badge-class_list'],
      autoload: true
    }}
    definition={BadgeList.definition}
    primaryAction={BadgeList.open}
    actions={(rows) => [{
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-pen',
      label: trans('edit'),
      target: `/badges/form/${rows[0].id}`,
      scope: ['object']
    }]}
    card={BadgeList.card}
  />

const Badges = connect(
  (state) => ({
    context: state.context,
    workspace: state.workspace
  }),
  null
)(BadgesList)

export {
  Badges
}
