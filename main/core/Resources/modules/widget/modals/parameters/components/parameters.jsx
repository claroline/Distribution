import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {actions as formActions} from '#/main/core/data/form/actions'

import {actions, selectors} from '#/main/core/widget/modals/parameters/store'
import {WidgetContainer as WidgetContainerTypes} from '#/main/core/widget/prop-types'
import {WidgetForm} from '#/main/core/widget/components/form'

const ParametersModalComponent = props =>
  <Modal
    {...omit(props, 'saveEnabled', 'save', 'widget', 'loadWidget')}
    icon="fa fa-fw fa-cog"
    title={trans('parameters')}
    subtitle={props.widget.name}
    onEntering={() => props.loadWidget(props.widget)}
  >
    <WidgetForm
      level={5}
      name={selectors.STORE_NAME}
    />

    <Button
      className="modal-btn btn"
      type="callback"
      primary={true}
      label={trans('save', {}, 'actions')}
      disabled={!props.saveEnabled}
      callback={() => {
        props.save(props.fadeModal)
        props.fadeModal()
      }}
    />
  </Modal>

ParametersModalComponent.propTypes = {
  widget: T.shape(
    WidgetContainerTypes.propTypes
  ).isRequired,
  loadWidget: T.func.isRequired,
  saveEnabled: T.bool.isRequired,
  save: T.func.isRequired,
  fadeModal: T.func.isRequired
}

const ParametersModal = connect(
  (state) => ({
    saveEnabled: selectors.saveEnabled(state)
  }),
  (dispatch) => ({
    loadWidget(widget) {
      dispatch(formActions.resetForm(selectors.STORE_NAME, widget))
    },

    save(close) {
      dispatch(actions.save(parent)).then(close)
    }
  })
)(ParametersModalComponent)

export {
  ParametersModal
}
