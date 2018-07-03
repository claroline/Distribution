import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'

import {WidgetContentForm} from '#/main/core/widget/content/components/form'
import {selectors} from '#/main/core/widget/content/modals/creation/store'

const MODAL_WIDGET_CONTENT_PARAMETERS = 'MODAL_WIDGET_CONTENT_PARAMETERS'

const ParametersModalComponent = props =>
  <Modal
    {...omit(props, 'widget', 'saveEnabled', 'add')}
    icon="fa fa-fw fa-plus"
    title={trans('new_content', {}, 'widget')}
    subtitle={trans('new_content_configure', {}, 'widget')}
  >
    <WidgetContentForm level={5} name={selectors.FORM_NAME} />

    <Button
      className="modal-btn btn"
      type="callback"
      primary={true}
      disabled={!props.saveEnabled}
      label={trans('add', {}, 'actions')}
      callback={() => {
        //props.add(props.widget)
        props.fadeModal()
      }}
    />
  </Modal>

ParametersModalComponent.propTypes = {
  /*widget: T.shape(
   WidgetContainerTypes.propTypes
   ).isRequired,*/
  saveEnabled: T.bool.isRequired,
  add: T.func.isRequired,
  fadeModal: T.func.isRequired
}

const ParametersModal = connect(
  (state) => ({
    saveEnabled: selectors.saveEnabled(state)
    //widget: selectors.widget(state)
  })
)(ParametersModalComponent)

export {
  MODAL_WIDGET_CONTENT_PARAMETERS,
  ParametersModal
}
