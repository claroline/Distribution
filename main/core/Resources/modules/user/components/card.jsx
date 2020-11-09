import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {asset} from '#/main/app/config/asset'
import {displayDate} from '#/main/app/intl/date'

import {DataCard} from '#/main/app/data/components/card'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {User as UserTypes} from '#/main/core/user/prop-types'

const UserCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.thumbnail ? asset(props.data.thumbnail.url) : null}
    icon={<UserAvatar picture={props.data.picture} alt={true} />}
    title={props.data.username}
    subtitle={props.data.firstName + ' ' + props.data.lastName}
    flags={[
      props.data.meta.personalWorkspace && ['fa fa-book', trans('has_personal_workspace')],
      !props.data.restrictions.disabled && ['fa fa-check-circle', trans('user_enabled')] // todo also checks accessibility dates
    ].filter(flag => !!flag)}
    contentText={props.data.meta.description}
    footer={props.data.meta.lastLogin &&
      <span>
        {trans('last_logged_at')} <b>{displayDate(props.data.meta.lastLogin, false, true)}</b>
      </span>
    }
  />

UserCard.propTypes = {
  data: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  UserCard
}
