import React from 'react'
import {connect} from 'react-redux'

import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {LINK_BUTTON} from '#/main/app/buttons'

import {BadgeForm} from '#/plugin/open-badge/badge/badges/components/badge-form'

const BadgeComponent = () =>
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
    </BadgeForm>
  </div>

const Badge = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'badges.current')),
    badge: formSelect.data(formSelect.form(state, 'badges.current')),
    context: state.context
  }),
  () =>({})
)(BadgeComponent)

export {
  Badge
}
