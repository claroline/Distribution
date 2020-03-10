import React from 'react'

import {getPlainText} from '#/main/app/data/types/html/utils'

import {DataCard} from '#/main/app/data/components/card'
import {UserAvatar} from '#/main/core/user/components/avatar'

const PostCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    icon={<UserAvatar picture={props.data.author ? props.data.author.picture : undefined} alt={true}/>}
    title={props.data.title}
    contentText={getPlainText(props.data.content)}
  />

export {
  PostCard
}
