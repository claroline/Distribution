import React from 'react'
import {connect} from 'react-redux'

import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {actions}    from '#/plugin/open-badge/workspace/badges/actions'

import {trans} from '#/main/app/intl/translation'
import {BadgeForm} from '#/plugin/open-badge/badge/badge-form'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
import {UserList} from '#/main/core/administration/user/user/components/user-list'
import {ListData} from '#/main/app/content/list/containers/data'

const BadgeComponent = props =>
  <div>
    <BadgeForm
      name="badges.current"
      buttons={true}
      target={(badge, isNew) => isNew ?
        ['apiv2_badge_create'] :
        ['apiv2_badge_update', {id: badge.id}]
      }
      cancel={{
        type: LINK_BUTTON,
        target: '/badges',
        exact: true
      }}
    >
      <FormSections
        level={3}
      >
        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-user"
          title={trans('users')}
          disabled={props.new}
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
            name="badges.current.users"
            fetch={{
              url: ['apiv2_badge_users_list', {badge: props.badge.id}],
              autoload: props.badge.id && !props.new
            }}
            primaryAction={UserList.open}
            delete={{
              url: ['apiv2_badge_remove_users', {badge: props.badge.id}]
            }}
            definition={UserList.definition}
            card={UserList.card}
          />
        </FormSection>
      </FormSections>
    </BadgeForm>
  </div>

const Badge = connect(
  state => {
    const badge = formSelect.data(formSelect.form(state, 'badges.current'))

    return {
      new: formSelect.isNew(formSelect.form(state, 'badges.current')),
      badge: badge
    }
  },
  dispatch =>({
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
)(BadgeComponent)

export {
  Badge
}
