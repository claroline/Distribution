import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConstants} from '#/main/app/content/list/constants'
import {AssertionList} from '#/plugin/open-badge/tools/badges/assertion/components/assertion-user-list'
import {selectors}  from '#/plugin/open-badge/tools/badges/store/selectors'
import {withRouter} from '#/main/app/router'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {connect} from 'react-redux'
import {selectors as toolSelectors} from '#/main/core/tool/store'

// todo : restore custom actions the same way resource actions are implemented
const ProfileBadgeList = props => {
  const id = props.match.params.id

  return (
    <ListData
      name={selectors.STORE_NAME + '.badges.mine'}
      fetch={{
        url: ['apiv2_assertion_user_list', {user: id}],
        autoload: true
      }}
      definition={AssertionList.definition}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        target: props.path + `/badges/assertion/${row.id}`,
        label: trans('', {}, 'actions')
      })}
      card={AssertionList.card}
      display={{current: listConstants.DISPLAY_LIST_SM}}
    />
  )
}

const RoutedProfileBadgeList = withRouter(connect(
  (state) => ({
    path: toolSelectors.path(state)
  })
)(ProfileBadgeList))

export {
  RoutedProfileBadgeList as ProfileBadgeList
}
