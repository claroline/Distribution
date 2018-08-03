import React from 'react'

import {getPlainText} from '#/main/app/data/html/utils'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'

const MessageCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    icon={<UserAvatar picture={props.data.message.creator ? props.data.message.creator.picture : undefined} alt={true}/>}
    title={props.data.message.subject}
    // flags={[
    //   ['fa fa-fw fa-thumb-tack', trans('stuck', {}, 'forum')]
    // ]}
    contentText={getPlainText(props.data.message.content)}
  />

export {
  MessageCard
}
