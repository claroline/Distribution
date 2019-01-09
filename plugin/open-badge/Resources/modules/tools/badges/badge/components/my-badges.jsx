import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConstants} from '#/main/app/content/list/constants'
import issue from '#/plugin/open-badge/tools/badges/badge/actions/issue'

import {AssertionList} from '#/plugin/open-badge/tools/badges/assertion/components/assertion-user-list'
// todo : restore custom actions the same way resource actions are implemented
export const MyBadges = () => {
  return(
    <ListData
      name="badges.mine"
      fetch={{
        url: ['apiv2_assertion_current_user_list'],
        autoload: true
      }}
      primaryAction={AssertionList.open}
      definition={AssertionList.definition}
      actions={(rows) => [issue(rows)]}
      card={AssertionList.card}
    />
  )
}


//display={{current: listConstants.DISPLAY_LIST_SM}}
