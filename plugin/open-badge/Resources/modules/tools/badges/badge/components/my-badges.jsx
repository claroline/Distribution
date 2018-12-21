import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConstants} from '#/main/app/content/list/constants'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api/router'

import {AssertionList} from '#/plugin/open-badge/tools/badges/assertion/components/assertion-user-list'
// todo : restore custom actions the same way resource actions are implemented
export const MyBadges = () =>
  <ListData
    name="badges.mine"
    fetch={{
      url: ['apiv2_assertion_current_user_list'],
      autoload: true
    }}
    definition={AssertionList.definition}
    primaryAction={AssertionList.open}
    actions={(rows) => [{
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-disk',
      label: trans('push-to-backpack'),
      scope: ['object'],
      callback: () => {
        OpenBadges.issue([url(['apiv2_open_badge__assertion', {assertion: rows[0].id}])], (errors, successes) => {
        })
      }
    }]}
    card={AssertionList.card}
    display={{current: listConstants.DISPLAY_LIST_SM}}
  />
