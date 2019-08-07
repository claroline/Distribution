import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import issue from '#/plugin/open-badge/tools/badges/badge/actions/issue'
import {selectors}  from '#/plugin/open-badge/tools/badges/store/selectors'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {AssertionList} from '#/plugin/open-badge/tools/badges/assertion/components/assertion-user-list'
import {connect} from 'react-redux'

// todo : restore custom actions the same way resource actions are implemented
const MyBadgesComponent = props => {
  return(
    <ListData
      name={selectors.STORE_NAME + '.badges.mine'}
      fetch={{
        url: ['apiv2_assertion_current_user_list'],
        autoload: true
      }}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        target: props.path + `/badges/assertion/${row.id}`,
        label: trans('', {}, 'actions')
      })}
      definition={AssertionList.definition}
      actions={(rows) => [issue(rows)]}
      card={AssertionList.card}
    />
  )
}

export const MyBadges = connect(
  (state) => ({
    path: toolSelectors.path(state)
  })
)(MyBadgesComponent)
