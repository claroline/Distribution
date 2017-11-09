import React from 'react'

import {t} from '#/main/core/translation'
import {localeDate} from '#/main/core/layout/data/types/date/utils'
import {UserAvatar} from '#/main/core/layout/user/components/user-avatar.jsx'

const UserCard = (row) => ({
  onClick: `#/users/${row.id}`,
  poster: null,
  icon: <UserAvatar picture={row.picture} alt={true} />,
  title: row.username,
  subtitle: row.firstName + ' ' + row.lastName,
  contentText: '',
  flags: [
    row.meta.personalWorkspace && ['fa fa-book',  t('has_personal_workspace')],
    row.meta.enabled           && ['fa fa-check', t('user_enabled')]
  ].filter(flag => !!flag),
  footer:
    <span>
      registered at <b>{localeDate(row.meta.created)}</b>,
    </span>
})

export {
  UserCard
}
