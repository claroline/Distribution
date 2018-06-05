import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store/selectors'
import {hasPermission} from '#/main/core/resource/permissions'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/actions'
import {Overview} from '#/plugin/forum/resources/forum/overview/components/overview'
import {BlockedMessages} from '#/plugin/forum/resources/forum/moderation/components/blocked-messages'
import {FlaggedPosts} from '#/plugin/forum/resources/forum/moderation/components/flagged-posts'
import {Editor} from '#/plugin/forum/resources/forum/editor/components/editor'
import {Player} from '#/plugin/forum/resources/forum/player/components/player'

const Resource = props => {
  const redirect = []
  const routes = [
    {
      path: '/edit',
      component: Editor,
      disabled: !props.editable
    }, {
      path: '/',
      exact: true,
      component: Overview,
      onEnter: () => props.loadLastMessages(props.forum.id),
      disabled: !props.forum.display.showOverview
    }, {
      path: '/subjects',
      component: Player
    }, {
      path: '/moderation/flagged',
      component: FlaggedPosts
    }, {
      path: '/moderation/blocked',
      component: BlockedMessages
    }

  ]
  if (!props.forum.display.showOverview) {
    // redirect to player
    redirect.push({
      from: '/',
      to: '/subjects',
      exact: true
    })
  }

  return (
    <ResourcePageContainer
      editor={{
        path: '/edit',
        save: {
          disabled: !props.saveEnabled,
          action: () => props.saveForm(props.forum.id)
        }
      }}
      customActions={[
        {
          type: 'link',
          icon: 'fa fa-fw fa-home',
          label: trans('show_overview'),
          displayed: props.forum.display.showOverview,
          target: '/',
          exact: true
        }, {
          type: 'link',
          icon: 'fa fa-fw fa-list-ul',
          label: trans('see_subjects', {}, 'forum'),
          target: '/subjects',
          exact: true
        }, {
          type: 'link',
          icon: 'fa fa-fw fa-plus',
          label: trans('create_subject', {}, 'forum'),
          target: '/subjects/form',
          exact: true
        }, {
          type: 'link',
          icon: 'fa fa-fw fa-gavel',
          label: trans('moderated_posts', {}, 'forum'),
          group: trans('moderation', {}, 'forum'),
          target: '/moderation/blocked',
          exact: true
        }, {
          type: 'link',
          icon: 'fa fa-fw fa-flag',
          label: trans('flagged_messages_subjects', {}, 'forum'),
          group: trans('moderation', {}, 'forum'),
          target: '/moderation/flagged',
          exact: true
        }
      ]}
    >
      <RoutedPageContent
        headerSpacer={false}
        redirect={redirect}
        routes={routes}
      />
    </ResourcePageContainer>
  )
}

Resource.propTypes = {
  forum: T.shape(ForumType.propTypes).isRequired,
  editable: T.bool.isRequired,
  saveEnabled: T.bool.isRequired,
  saveForm: T.func.isRequired,
  loadLastMessages: T.func.isRequired
}

const ForumResource = connect(
  (state) => ({
    forum: select.forum(state),
    editable: hasPermission('edit', resourceSelect.resourceNode(state)),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'forumForm'))
  }),
  (dispatch) => ({
    saveForm(forumId) {
      dispatch(formActions.saveForm('forumForm', ['apiv2_forum_update', {id: forumId}]))
    },
    loadLastMessages(forumId) {
      dispatch(actions.fetchLastMessages(forumId))
    }
  })
)(Resource)

export {
  ForumResource
}
