import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'
import {RoutedPageContent} from '#/main/core/layout/router'

import {Editor} from '#/plugin/wiki/resources/wiki/editor/components/editor'
import {Player} from '#/plugin/wiki/resources/wiki/player/components/player'
import {History} from '#/plugin/wiki/resources/wiki/history/components/history'
import {VersionDetail} from '#/plugin/wiki/resources/wiki/history/components/version-detail'
import {VersionCompare} from '#/plugin/wiki/resources/wiki/history/components/version-compare'
import {actions} from '#/plugin/wiki/resources/wiki/store'

const Resource = props =>
  <ResourcePageContainer
    editor={{
      path: '/edit',
      label: trans('configure', {}, 'platform'),
      save: {
        disabled: !props.saveEnabled,
        action: () => props.saveForm(props.wiki.id)
      }
    }}
    customActions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-home',
        label: trans('show_overview'),
        target: '/'
      }
    ]}
  >
    <RoutedPageContent
      headerSpacer={false}
      routes={[
        {
          path: '/',
          exact: true,
          component: Player
        }, {
          path: '/edit',
          component: Editor,
          disabled: !props.canEdit,
          onLeave: () => props.resetForm(),
          onEnter: () => props.resetForm(props.wiki)
        }, {
          path: '/history/:id',
          exact: true,
          component: History,
          onLeave: () => props.setCurrentSection(),
          onEnter: params => props.setCurrentSection(params.id)
        }, {
          path: '/contribution/:sectionId/:id',
          exact: true,
          component: VersionDetail,
          onLeave: () => props.setCurrentVersion(),
          onEnter: params => props.setCurrentVersion(params.sectionId, params.id)
        }, {
          path: '/contribution/compare/:sectionId/:id1/:id2',
          exact: true,
          component: VersionCompare,
          onLeave: () => props.setCompareVersionSet(),
          onEnter: params => props.setCompareVersionSet(params.sectionId, params.id1, params.id2)
        }
      ]}
    />
  </ResourcePageContainer>

Resource.propTypes = {
  canEdit: T.bool.isRequired,
  wiki: T.object.isRequired,
  saveEnabled: T.bool.isRequired,
  sectionTree: T.object,
  resetForm: T.func.isRequired,
  saveForm: T.func.isRequired,
  setCurrentSection: T.func.isRequired,
  setCurrentVersion: T.func.isRequired,
  setCompareVersionSet: T.func.isRequired
}

const WikiResource = connect(
  (state) => ({
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    wiki: state.wiki,
    sectionTree: state.sectionTree,
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'wikiForm'))
  }),
  (dispatch) => ({
    resetForm: (formData) => dispatch(formActions.resetForm('wikiForm', formData)),
    saveForm: (wikiId) => dispatch(formActions.saveForm('wikiForm', ['apiv2_wiki_update_options', {id: wikiId}])),
    setCurrentSection: (sectionId = null) => dispatch(actions.setCurrentSection(sectionId)),
    setCurrentVersion: (sectionId = null, contributionId = null) => dispatch(actions.setCurrentVersion(sectionId, contributionId)),
    setCompareVersionSet: (sectionId = null, contrib1 = null, contrib2 = null) => dispatch(actions.setCompareVersionSet(sectionId, contrib1, contrib2))
  })
)(Resource)

export {
  WikiResource
}