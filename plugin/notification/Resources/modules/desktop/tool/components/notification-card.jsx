import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {asset} from '#/main/app/config/asset'
import {displayDate} from '#/main/app/intl/date'

import {DataCard} from '#/main/app/content/card/components/data'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {User as UserTypes} from '#/main/core/user/prop-types'

const Notification = props => <div dangerouslySetInnerHTML={{__html: props.notification.text}}/>

const NotificationCard = props => {
  console.log(props)
  return(
    <DataCard
      {...props}
      id={props.data.id}
      poster={null}
      icon={<UserAvatar picture={props.data.picture} alt={true} />}
      title={props.data.username}
      subtitle={props.data.firstName + ' ' + props.data.lastName}
      contentText={<Notification notification={props.data}/>}
      footer={
        <span>
          {trans('last_logged_at')}
        </span>
      }
    />
  )
}

NotificationCard.propTypes = {
  data: T.shape(
    UserTypes.propTypes
  ).isRequired
}

export {
  NotificationCard
}
