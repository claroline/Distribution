import React from 'react'
import {connect} from 'react-redux'
import {trans} from '#/main/app/intl/translation'

import {actions}    from '#/plugin/open-badge/badge/actions'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {UserList} from '#/main/core/administration/user/user/components/user-list'
import {AssertionList} from '#/plugin/open-badge/badge/badges/components/assertion-list'
import {ListData} from '#/main/app/content/list/containers/data'
import {FormSection} from '#/main/app/content/form/components/sections'

import {
  selectors as formSelect
} from '#/main/app/content/form/store'

// TODO : add tools
const BadgeViewerComponent = (props) => {
  return (
    <div>
      <div>
        badge
      </div>

      <FormSection
        className="embedded-list-section"
        icon="fa fa-fw fa-user"
        title={trans('users')}
        actions={[
          {
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-plus',
            label: trans('add_users'),
            callback: () => props.pickUsers(props.badge.id)
          }
        ]}
      >
        <ListData
          name="badges.current.assertions"
          fetch={{
            url: ['apiv2_badge-class_assertion', {badge: props.badge.id}],
            autoload: props.badge.id && !props.new
          }}
          primaryAction={AssertionList.open}
          delete={{
            url: ['apiv2_badge_remove_users', {badge: props.badge.id}]
          }}
          definition={AssertionList.definition}
          card={AssertionList.card}
        />
      </FormSection>
    </div>
  )
}

const BadgeViewer = connect(
  (state) => ({
    context: state.context,
    badge: formSelect.data(formSelect.form(state, 'badges.current'))
  }),
  (dispatch) =>({
    save(badge, workspace, isNew) {
      dispatch(actions.save('badges.current', badge, workspace, isNew))
    },
    pickUsers(groupId) {
      dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        icon: 'fa fa-fw fa-user',
        title: trans('add_users'),
        confirmText: trans('add'),
        name: 'users.picker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_user_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addUsers(groupId, selected))
      }))
    }
  })
)(BadgeViewerComponent)

export {
  BadgeViewer
}
