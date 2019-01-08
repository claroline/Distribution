import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConstants} from '#/main/app/content/list/constants'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {AssertionList} from '#/plugin/open-badge/tools/badges/assertion/components/assertion-user-list'
import {url} from '#/main/app/api/router'
import {trans} from '#/main/app/intl/translation'

// todo : restore custom actions the same way resource actions are implemented
const ProfileBadgeList = props =>
  <ListData
    name="badges.mine"
    fetch={{
      url: ['apiv2_assertion_user_list', {user: props.id}],
      autoload: true
    }}
    definition={AssertionList.definition}
    primaryAction={AssertionList.open}
    actions={(rows) => [{
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-save',
      label: trans('push-to-backpack'),
      scope: ['object'],
      displayed: true,
      callback: () => {
        OpenBadges.issue([url(['apiv2_open_badge__assertion', {assertion: rows[0].id}, true])], (errors, successes) => {})
      }
    }]}
    card={AssertionList.card}
    display={{current: listConstants.DISPLAY_LIST_SM}}
  />

export {
  ProfileBadgeList
}
