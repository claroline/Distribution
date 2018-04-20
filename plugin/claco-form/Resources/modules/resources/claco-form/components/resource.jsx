import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {currentUser} from '#/main/core/user/current'
import {makeId} from '#/main/core/scaffolding/id'
import {trans} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'
import {RoutedPageContent} from '#/main/core/layout/router'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

import {actions as editorActions} from '#/plugin/claco-form/resources/claco-form/editor/actions'
import {actions as entryActions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'
import {select} from '#/plugin/claco-form/resources/claco-form/selectors'
import {ClacoForm as ClacoFormType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {ClacoFormMainMenu} from '#/plugin/claco-form/resources/claco-form/player/components/claco-form-main-menu.jsx'
import {Editor} from '#/plugin/claco-form/resources/claco-form/editor/components/editor.jsx'
import {TemplateForm} from '#/plugin/claco-form/resources/claco-form/editor/template/components/template-form.jsx'
import {Entries} from '#/plugin/claco-form/resources/claco-form/player/entry/components/entries.jsx'
import {EntryForm} from '#/plugin/claco-form/resources/claco-form/player/entry/components/entry-form.jsx'
import {Entry} from '#/plugin/claco-form/resources/claco-form/player/entry/components/entry.jsx'

function getHome(type) {
  switch (type) {
    case 'search':
      return Entries

    case 'add':
      return EntryForm

    case 'random':
      return Entry

    case 'menu':
    default:
      return ClacoFormMainMenu
  }
}

const Resource = props =>
  <ResourcePageContainer
    editor={{
      path: '/edit',
      save: {
        disabled: !props.saveEnabled,
        action: () => props.saveForm(props.clacoForm.id)
      }
    }}
    customActions={[
      {
        icon: 'fa fa-fw fa-home',
        label: trans('main_menu', {}, 'clacoform'),
        action: '#/menu'
      }, {
        icon: 'fa fa-fw fa-plus',
        label: trans('add_entry', {}, 'clacoform'),
        displayed: props.canAddEntry,
        action: '#/entry/form'
      }, {
        icon: 'fa fa-fw fa-search',
        label: trans('entries_list', {}, 'clacoform'),
        displayed: props.canSearchEntry,
        action: '#/entries'
      }, {
        icon: 'fa fa-fw fa-file-text-o',
        label: trans('template_management', {}, 'clacoform'),
        displayed: props.canEdit,
        action: '#/template'
      }, {
        icon: 'fa fa-fw fa-upload',
        label: trans('export_all_entries', {}, 'clacoform'),
        displayed: props.canEdit,
        action: generateUrl('claro_claco_form_entries_export', {clacoForm: props.clacoForm.id})
      }, {
        icon: 'fa fa-fw fa-trash-o',
        label: trans('delete_all_entries', {}, 'clacoform'),
        displayed: props.canEdit,
        action: props.deleteEntries,
        dangerous: true
      }
    ]}
  >
    <RoutedPageContent
      headerSpacer={false}
      redirect={[]}
      routes={[
        {
          path: '/',
          component: getHome(props.defaultHome),
          exact: true
        }, {
          path: '/menu',
          component: ClacoFormMainMenu
        }, {
          path: '/edit',
          component: Editor,
          disabled: !props.canEdit,
          onLeave: () => props.resetForm(),
          onEnter: () => props.resetForm(props.clacoForm)
        }, {
          path: '/template',
          component: TemplateForm,
          disabled: !props.canEdit
        }, {
          path: '/entries',
          component: Entries,
          exact: true
        }, {
          path: '/entries/:id',
          component: Entry,
          onEnter: (params) => {
            props.openEntryForm(params.id, props.clacoForm.id)
            props.loadEntryUser(params.id)
          },
          onLeave: () => {
            props.resetEntryForm()
            props.resetEntryUser()
          }
        }, {
          path: '/entry/form/:id?',
          component: EntryForm,
          onEnter: (params) => {
            props.openEntryForm(params.id, props.clacoForm.id)

            if (params.id) {
              props.loadEntryUser(params.id)
            }
          },
          onLeave: () => {
            props.resetEntryForm()
            props.resetEntryUser()
          }
        }
      ]}
    />
  </ResourcePageContainer>

Resource.propTypes = {
  clacoForm: T.shape(ClacoFormType.propTypes).isRequired,
  canEdit: T.bool.isRequired,
  canAddEntry: T.bool.isRequired,
  canSearchEntry: T.bool.isRequired,
  defaultHome: T.string.isRequired,
  saveEnabled: T.bool.isRequired,
  resetForm: T.func.isRequired,
  saveForm: T.func.isRequired,
  deleteEntries: T.func.isRequired,
  openEntryForm: T.func.isRequired,
  resetEntryForm: T.func.isRequired,
  loadEntryUser: T.func.isRequired,
  resetEntryUser: T.func.isRequired
}

const ClacoFormResource = connect(
  (state) => ({
    clacoForm: select.clacoForm(state),
    canEdit: resourceSelect.editable(state),
    canAddEntry: select.canAddEntry(state),
    canSearchEntry: select.canSearchEntry(state),
    defaultHome: select.getParam(state, 'default_home'),
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'clacoFormForm'))
  }),
  (dispatch) => ({
    resetForm(formData) {
      dispatch(formActions.resetForm('clacoFormForm', formData))
    },
    saveForm(id) {
      dispatch(formActions.saveForm('clacoFormForm', ['apiv2_clacoform_update', {id: id}]))
    },
    deleteEntries() {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: trans('delete_all_entries', {}, 'clacoform'),
          question: trans('delete_all_entries_confirm', {}, 'clacoform'),
          handleConfirm: () => dispatch(editorActions.deleteAllEntries())
        })
      )
    },
    openEntryForm(id, clacoFormId) {
      const defaultValue = {
        id: makeId(),
        values: {},
        clacoForm: {
          id: clacoFormId
        },
        user: currentUser()
      }

      dispatch(entryActions.openForm('entries.current', id, defaultValue))
    },
    resetEntryForm() {
      dispatch(formActions.resetForm('entries.current', {}, true))
    },
    loadEntryUser(entryId) {
      dispatch(entryActions.loadEntryUser(entryId))
    },
    resetEntryUser() {
      dispatch(entryActions.resetEntryUser())
    }
  })
)(Resource)

export {
  ClacoFormResource
}
