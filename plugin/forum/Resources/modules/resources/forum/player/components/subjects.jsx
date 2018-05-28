import React, {Component} from 'react'
import {connect} from 'react-redux'

import {trans, transChoice} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {constants as listConst} from '#/main/core/data/list/constants'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'


import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/player/actions'

class SubjectsList extends Component {
  constructor(props) {
    super(props)
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
              name: 'meta.closed',
              type: 'boolean',
              label: trans('closed_subject', {}, 'forum'),
              displayed: true
            }, {
              name: 'meta.sticky',
              type: 'boolean',
              label: trans('stuck', {}, 'forum'),
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
            }, {
              name: 'tags',
              type: 'string',
              label: trans('tags'),
              displayed: true
            }
            // {
            //   name: 'meta.creator',
            //   type: 'string',
            //   label: trans('creator'),
            //   displayed: true
            // }
          ]}
          actions={(rows) => [
            {
              type: 'link',
              icon: 'fa fa-fw fa-eye',
              label: trans('see_subject', {}, 'forum'),
              target: '/subjects/show/'+rows[0].id,
              context: 'row'
            }, {
              type: 'link',
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit'),
              target: '/subjects/form/'+rows[0].id,
              context: 'row'
            }, {
              type: 'callback',
              icon: 'fa fa-fw fa-thumb-tack',
              label: trans('stick', {}, 'forum'),
              callback: () => this.props.stickSubject(rows[0]),
              displayed: !rows[0].meta.sticky
            }, {
              type: 'callback',
              icon: 'fa fa-fw fa-thumb-tack',
              label: trans('unstick', {}, 'forum'),
              callback: () => this.props.unStickSubject(rows[0]),
              displayed: rows[0].meta.sticky
            }, {
              type: 'callback',
              icon: 'fa fa-fw fa-times-circle-o',
              label: trans('close_subject', {}, 'forum'),
              callback: () => this.props.closeSubject(rows[0]),
              displayed: !rows[0].meta.closed
            }, {
              type: 'callback',
              icon: 'fa fa-fw fa-check-circle-o',
              label: trans('open_subject', {}, 'forum'),
              callback: () => this.props.unCloseSubject(rows[0]),
              displayed: rows[0].meta.closed
            }
          ]}
          card={(props) =>
            <DataCard
              {...props}
              id={props.data.id}
              icon={<UserAvatar picture={props.data.meta.creator ? props.data.meta.creator.picture : undefined} alt={true}/>}
              title={props.data.title}
              // poster={props.data.poster.url}
              subtitle={transChoice('replies', props.data.meta.messages, {count: props.data.meta.messages}, 'forum')}
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
  }),
  dispatch => ({
    stickSubject(subject) {
      dispatch(actions.stickSubject(subject))
    },
    unStickSubject(subject) {
      dispatch(actions.unStickSubject(subject))
    },
    closeSubject(subject) {
      dispatch(actions.closeSubject(subject))
    },
    unCloseSubject(subject) {
      dispatch(actions.unCloseSubject(subject))
    }
  })
)(SubjectsList)

export {
  Subjects
}
