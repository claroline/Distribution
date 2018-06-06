import React from 'react'
// import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {constants as listConst} from '#/main/core/data/list/constants'
import {DataCard} from '#/main/core/data/components/data-card'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {url} from '#/main/app/api'
import {actions as listActions} from '#/main/core/data/list/actions'

import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {FlaggedPostsNav} from '#/plugin/forum/resources/forum/moderation/components/flagged-posts-nav'

const FlaggedSubjectsComponent = (props) =>
  <div>
    <FlaggedPostsNav />
    <div className="user-profile-content col-md-9">
      <DataListContainer
        name="moderation.flaggedSubjects"
        fetch={{
          url: ['apiv2_forum_subject_flagged_list', {forum: props.forum.id}]
        }}
        delete={{
          url: ['apiv2_forum_subject_delete_bulk']
        }}
        display={{
          current: listConst.DISPLAY_LIST_SM
        }}
        definition={[
          {
            name: 'content',
            type: 'string',
            label: trans('message'),
            displayed: true,
            primary: true
          }, {
            name: 'title',
            type: 'string',
            label: trans('subject_title', {}, 'forum'),
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
            type: 'callback',
            icon: 'fa fa-fw fa-flag',
            label: trans('unflag', {}, 'forum'),
            displayed: true,
            callback: () => props.unFlagSubject(rows[0])
          }
        ]}
        card={(props) =>
          <DataCard
            {...props}
            id={props.data.id}
            icon={<UserAvatar picture={props.data.meta.creator ? props.data.meta.creator.picture : undefined} alt={true}/>}
            title={props.data.content}
            subtitle={props.data.subject.title}
          />
        }
      />
    </div>
  </div>

const FlaggedSubjects = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  }),
  dispatch => ({
    unFlagSubject(subject) {
      dispatch(actions.unFlag(subject))
      dispatch(listActions.invalidateData('moderation.flaggedSubjects'))
    }
  })
)(FlaggedSubjectsComponent)

export {
  FlaggedSubjects
}
