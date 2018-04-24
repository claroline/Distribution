import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'

import {select} from '#/plugin/forum/resources/forum/selectors'
import {Overview} from '#/plugin/forum/resources/forum/overview/components/overview'
import {Editor} from '#/plugin/forum/resources/forum/editor/components/editor'
import {Player} from '#/plugin/forum/resources/forum/player/components/player'

const Resource = props => {
  const redirect = []
  const routes = [
    {
      path: '/edit',
      component: Editor,
      displayed: props.editable
    }, {
      path: '/play',
      component: Player
    }, {
      path: '/',
      exact: true,
      component: Overview,
      displayed: props.forum.display.showOverview
    }
  ]

  if (!props.forum.display.showOverview) {
    // redirect to player
    redirect.push({
      from: '/',
      to: '/play',
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
          target: '/play'
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
  forum: T.object.isRequired,
  editable: T.bool.isRequired,
  saveEnabled: T.bool.isRequired,

  saveForm: T.func.isRequired
}

const ForumResource = connect(
  (state) => ({
    forum: select.forum(state),
    editable: resourceSelect.editable(state),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'forumForm'))
  }),
  (dispatch) => ({
    saveForm: (forumId) => dispatch(formActions.saveForm('forumForm', ['apiv2_forum_update', {id: forumId}]))
  })
)(Resource)

export {
  ForumResource
}
