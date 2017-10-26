import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, trans} from '#/main/core/translation'

import {Router} from '#/main/core/router/components/router.jsx'
import {ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

import {Menu} from './menu.jsx'
import {DropzoneForm} from '../editor/components/dropzone-form.jsx'

import {select} from '../selectors.js'
import {actions as editorActions} from '../editor/actions.js'

const DropzoneResource = props =>
  <ResourceContainer
    editor={{
      opened: props.formOpened,
      open: '#/edit',
      label: t('configure'),
      save: {
        disabled: !props.formPendingChanges,
        action: () => {
          props.saveDropzone(props.dropzoneId, props.dropzoneForm)
        }
      }
    }}
    customActions={[
      {
        icon: 'fa fa-fw fa-list',
        label: trans('menu', {}, 'dropzone'),
        action: '#/'
      }
    ]}
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
        }
      ]}
    />
  </ResourceContainer>

DropzoneResource.propTypes = {
  dropzone: T.object.isRequired,
  dropzoneId: T.string.isRequired,

  dropzoneForm: T.object,
  formOpened: T.bool.isRequired,
  formPendingChanges: T.bool.isRequired,

  loadForm: T.func.isRequired,
  resetForm: T.func.isRequired,
  saveDropzone: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzone: state.dropzone,
    dropzoneId: select.dropzoneId(state),
    dropzoneForm: select.formData(state),
    formOpened: select.formIsOpened(state),
    formPendingChanges: select.formHasPendingChanges(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadForm: (dropzone) => dispatch(editorActions.loadForm(dropzone)),
    resetForm: () => dispatch(editorActions.resetForm()),
    saveDropzone: (dropzoneId, data) => dispatch(editorActions.saveDropzone(dropzoneId, data))
  }
}

const ConnectedDropzoneResource = connect(mapStateToProps, mapDispatchToProps)(DropzoneResource)

export {
  ConnectedDropzoneResource as DropzoneResource
}
