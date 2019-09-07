import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'

import {DataCard} from '#/main/app/content/card/components/data'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {displayUsername} from '#/main/core/user/utils'

const NotificationCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    className={classes('notification-card', props.className, {
      'data-card-muted': props.data.read
    })}
    icon={
      <UserAvatar picture={get(props.data, 'notification.meta.creator.picture')} alt={true} />
    }
    title={displayUsername(get(props.data, 'notification.meta.creator')) + ' ' + props.data.text}
    subtitle={trans('done_at', {
      date: displayDate(get(props.data, 'notification.meta.created'), false, true)
    }, 'notification')}
  />

NotificationCard.propTypes = {
  className: T.string,
  data: T.shape({
    id: T.number.isRequired,
    read: T.bool.isRequired,
    text: T.string.isRequired
    // todo
  }).isRequired
}

export {
  NotificationCard
}
