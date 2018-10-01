import React from 'react'

import {getPlainText} from '#/main/app/data/html/utils'
import {DataCard} from '#/main/core/data/components/data-card'
import {trans, transChoice} from '#/main/core/translation'

const AnnouncementCard = (props) =>
  <DataCard
    {...props}
    id={props.data.id}
    title={props.data.title}
    contentText={getPlainText(props.data.content)}
    footer={
      <span>
        {trans('created_by', {
          creator: props.data.meta.creator ? props.data.meta.creator.username: trans('unknown'),
          creationDate: props.data.meta.publishedAt
        })}
      </span>
    }
  />

export {
  AnnouncementCard
}
