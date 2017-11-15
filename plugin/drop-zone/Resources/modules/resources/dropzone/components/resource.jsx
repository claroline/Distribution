import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, trans} from '#/main/core/translation'

import {Router} from '#/main/core/router/components/router.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {Menu} from './menu.jsx'
import {DropzoneForm} from '../editor/components/dropzone-form.jsx'
import {MyDrop} from '../player/components/my-drop.jsx'
import {Drops} from '../correction/components/drops.jsx'
import {Drop} from '../correction/components/drop.jsx'
import {PeerDrop} from '../player/components/peer-drop.jsx'

import {select} from '../selectors.js'
import {actions as editorActions} from '../editor/actions.js'
import {actions as playerActions} from '../player/actions.js'
import {actions as correctionActions} from '../correction/actions.js'

const DropzoneResource = props =>
  <ResourceContainer
    editor={{
      opened: props.formOpened,
      open: '#/edit',
      label: t('configure'),
      save: {
        disabled: !props.formPendingChanges || (props.formValidating && !props.formValid),
        action: () => {
          props.saveDropzone(props.dropzoneId, props.dropzoneForm)
        }
      }
    }}
    customActions={customActions(props)}
  >
    <Router
      routes={[
        {
          path: '/',
          component: Menu
        }, {
          path: '/edit',
          component: DropzoneForm,
          onEnter: () => props.loadForm(props.dropzone),
          onLeave: props.resetForm
        }, {
          path: '/my/drop',
          component: MyDrop
        }, {
          path: '/drops',
          component: Drops,
          onEnter: () => props.fetchDrops(props.dropzoneId)
        }, {
          path: '/drop/:id',
          component: Drop,
          onEnter: (params) => props.fetchDrop(params.id),
          onLeave: () => props.resetCurrentDrop()
        }, {
          path: '/peer/drop',
          component: PeerDrop,
          onEnter: () => props.fetchPeerDrop(),
        }
      ]}
    />
  </ResourceContainer>

DropzoneResource.propTypes = {
  canEdit: T.bool.isRequired,
  dropzone: T.object.isRequired,
  dropzoneId: T.string.isRequired,

  dropzoneForm: T.object,
  formOpened: T.bool.isRequired,
  formPendingChanges: T.bool.isRequired,
  formValidating: T.bool.isRequired,
  formValid: T.bool.isRequired,

  loadForm: T.func.isRequired,
  resetForm: T.func.isRequired,
  saveDropzone: T.func.isRequired,
  fetchDrops: T.func.isRequired,
  fetchDrop: T.func.isRequired,
  resetCurrentDrop: T.func.isRequired
}

function customActions(props) {
  const actions = []

  actions.push({
    icon: 'fa fa-fw fa-list',
    label: trans('menu', {}, 'dropzone'),
    action: '#/'
  })
  actions.push({
    icon: 'fa fa-fw fa-download',
    label: trans('my_drop', {}, 'dropzone'),
    action: '#/my/drop'
  })

  if (props.canEdit) {
    actions.push({
      icon: 'fa fa-fw fa-check-square-o',
      label: trans('correction', {}, 'dropzone'),
      action: '#/drops'
    })
  }

  return actions
}

function mapStateToProps(state) {
  return {
    canEdit: select.canEdit(state),
    dropzone: state.dropzone,
    dropzoneId: select.dropzoneId(state),
    dropzoneForm: select.formData(state),
    formOpened: select.formIsOpened(state),
    formPendingChanges: select.formHasPendingChanges(state),
    formValid: select.formValid(state),
    formValidating: select.formValidating(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadForm: (dropzone) => dispatch(editorActions.loadForm(dropzone)),
    resetForm: () => dispatch(editorActions.resetForm()),
    saveDropzone: (dropzoneId, data) => dispatch(editorActions.saveDropzone(dropzoneId, data)),
    fetchDrops: (dropzoneId) => dispatch(correctionActions.fetchDrops(dropzoneId)),
    fetchDrop: (dropId) => dispatch(correctionActions.fetchDrop(dropId)),
    resetCurrentDrop: () => dispatch(correctionActions.resetCurrentDrop()),
    fetchPeerDrop: () => dispatch(playerActions.fetchPeerDrop())
  }
}

const ConnectedDropzoneResource = connect(mapStateToProps, mapDispatchToProps)(DropzoneResource)

export {
  ConnectedDropzoneResource as DropzoneResource
}
