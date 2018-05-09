import React, {Component} from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {constants as listConst} from '#/main/core/data/list/constants'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'


import {select} from '#/plugin/forum/resources/forum/selectors'


class SubjectsList extends Component {
  constructor(props) {
    super(props)
  }

  stickSubject(subject) {
    console.log(subject.meta.sticky)
  }

  editSubject(subject) {
    console.log(subject.meta.sticky)
  }

  render() {
    return (
      <div>
        <h2>{trans('subjects', {}, 'forum')}</h2>
        <DataListContainer
          name="subjects.list"
          fetch={{
            url: ['claroline_forum_api_forum_getsubjects', {id: this.props.forum.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_forum_subject_delete_bulk']
          }}
          primaryAction={(subject) => ({
            type: 'link',
            target: '/subjects/show/'+subject.id,
            label: trans('open', {}, 'actions')
          })}
          display={{
            current: listConst.DISPLAY_LIST_SM
          }}
          definition={[
            {
              name: 'title',
              type: 'string',
              label: trans('title'),
              displayed: true,
              primary: true
            }, {
              name: 'tags',
              type: 'string',
              label: trans('tags'),
              displayed: true
            }, {
              name: 'meta.messages',
              type: 'number',
              label: trans('posts', {}, 'forum'),
              displayed: true
            }, {
              name: 'meta.updated',
              type: 'date',
              label: trans('last_modification'),
              displayed: true,
              option: {
                time: true
              }
            }
            // {
            //   name: 'creator',
            //   type: 'string',
            //   label: trans('creator'),
            //   displayed: true
            // }
          ]}
          actions={(row) => [
            {
              type: 'link',
              icon: 'fa fa-fw fa-eye',
              label: trans('see_subject', {}, 'forum'),
              target: '/subjects/show/'+row.id,
              context: 'row'
            }, {
              type: 'callback',
              icon: 'fa fa-fw fa-paperclip',
              label: trans('stick', {}, 'forum'),
              callback: () => this.stickSubject(row[0]),
              // displayed: !row[0].locked && this.canManageEntry(row[0]),
              context: 'row'
            }, {
              type: 'callback',
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit'),
              callback: () => this.editSubject(row[0]),
              // displayed: !row[0].locked && this.canManageEntry(row[0]),
              context: 'row'
            }
          ]}
          card={(props) =>
            <DataCard
              {...props}
              id={props.data.id}
              icon={<UserAvatar picture={props.data.meta.creator ? props.data.meta.creator.picture : undefined} alt={true}/>}
              title={props.data.title}
              subtitle={props.data.meta.messages+'message(s)'}
              // contentText={props.data)}
            />
          }
        />
      </div>
    )
  }
}

const Subjects = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  })
)(SubjectsList)

export {
  Subjects
}
