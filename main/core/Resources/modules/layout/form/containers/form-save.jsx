import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {actions} from '#/main/core/layout/form/actions'
import {select} from '#/main/core/layout/form/selectors'

// this is a HOC to allow any button component with the correct interface
// it will set `title`, `disabled`, `action` props of the passed btn component
function makeSaveAction(formName) {
  return (ButtonComponent) => {
    const SaveWrapper = props =>
      <ButtonComponent
        id={`save-${formName}-btn`}
        icon="fa fa-floppy-o"
        title={t('save')}
        primary={true}
        disabled={!props.saveEnabled}
        action={props.save}

        {...props} // we put passed props at the end to be able to override it
      />

    SaveWrapper.propTypes = {
      saveEnabled: T.bool.isRequired,
      save: T.func.isRequired
    }

    SaveWrapper.displayName = `SaveWrapper(${formName})`

    // connect it to the store
    return connect(
      state => ({
        saveEnabled: select.saveEnabled(select.form(state, formName))
      }),
      dispatch => ({
        save: () => dispatch(actions.save(formName))
      })
    )(SaveWrapper)
  }
}

export {
  makeSaveAction
}
