import React from 'react'

import {transChoice} from '#/main/core/translation'
import {getPlainText} from '#/main/core/data/types/html/utils'
import {asset} from '#/main/core/scaffolding/asset'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'

const SubjectCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    icon={<UserAvatar picture={props.data.meta.creator ? props.data.meta.creator.picture : undefined} alt={true}/>}
    title={props.data.title}
    poster={props.data.poster ? asset(props.data.poster.url) : null}
    subtitle={transChoice('replies', props.data.meta.messages, {count: props.data.meta.messages}, 'forum')}
    contentText={getPlainText(props.contentText)}
  />

export {
  SubjectCard
}
