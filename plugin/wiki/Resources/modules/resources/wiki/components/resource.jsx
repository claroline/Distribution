import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'
import {url} from '#/main/app/api'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {ResourcePage} from '#/main/core/resource/containers/page'
import {RoutedPageContent} from '#/main/core/layout/router'
import {DOWNLOAD_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

import {Editor} from '#/plugin/wiki/resources/wiki/editor/components/editor'
import {Player} from '#/plugin/wiki/resources/wiki/player/components/player'
import {History} from '#/plugin/wiki/resources/wiki/history/components/history'
import {VersionDetail} from '#/plugin/wiki/resources/wiki/history/components/version-detail'
import {VersionCompare} from '#/plugin/wiki/resources/wiki/history/components/version-compare'
import {DeletedSections} from '#/plugin/wiki/resources/wiki/deleted/components/deleted-sections'
import {actions as historyActions} from '#/plugin/wiki/resources/wiki/history/store'

const Resource = props =>
  <ResourcePage
    primaryAction="create-section"
    editor={{
      path: '/edit',
      label: trans('configure', {}, 'platform')
    }}
    customActions={[
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-home',
        label: trans('show_overview'),
        target: '/',
        primary: false
      },
      {
        type: DOWNLOAD_BUTTON,
        icon: 'fa fa-fw fa-file-pdf-o',
        displayed: props.canExport,
        label: trans('pdf_export'),
        file: {
          url: url(['icap_wiki_export_pdf', {id: props.wiki.id}])
        }
      },
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-trash-o',
        displayed: props.canEdit,
        label: trans('deleted_sections', {}, 'icap_wiki'),
        target: '/section/deleted'
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
          onLeave: () => props.setCurrentHistorySection(),
          onEnter: params => props.setCurrentHistorySection(params.id)
        }, {
          path: '/contribution/:sectionId/:id',
          exact: true,
          component: VersionDetail,
          onLeave: () => props.setCurrentHistoryVersion(),
          onEnter: params => props.setCurrentHistoryVersion(params.sectionId, params.id)
        }, {
          path: '/contribution/compare/:sectionId/:id1/:id2',
          exact: true,
          component: VersionCompare,
          onLeave: () => props.setCurrentHistoryCompareSet(),
          onEnter: params => props.setCurrentHistoryCompareSet(params.sectionId, params.id1, params.id2)
        },
        {
          path: '/section/deleted',
          component: DeletedSections,
          exact: true,
          disabled: !props.canEdit
        }
      ]}
    />
  </ResourcePage>

Resource.propTypes = {
  canEdit: T.bool.isRequired,
  canExport: T.bool.isRequired,
  wiki: T.object.isRequired,
  saveEnabled: T.bool.isRequired,
  resetForm: T.func.isRequired,
  setCurrentHistorySection: T.func.isRequired,
  setCurrentHistoryVersion: T.func.isRequired,
  setCurrentHistoryCompareSet: T.func.isRequired
}

const WikiResource = connect(
  (state) => ({
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    canExport: hasPermission('export', resourceSelect.resourceNode(state)) && state.exportPdfEnabled,
    wiki: state.wiki,
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'wikiForm'))
  }),
  (dispatch) => ({
    resetForm: (formData) => dispatch(formActions.resetForm('wikiForm', formData)),
    setCurrentHistorySection: (sectionId = null) => dispatch(historyActions.setCurrentHistorySection(sectionId)),
    setCurrentHistoryVersion: (sectionId = null, contributionId = null) => dispatch(historyActions.setCurrentHistoryVersion(sectionId, contributionId)),
    setCurrentHistoryCompareSet: (sectionId = null, id1 = null, id2 = null) => dispatch(historyActions.setCurrentHistoryCompareSet(sectionId, id1, id2))
  })
)(Resource)

export {
  WikiResource
}