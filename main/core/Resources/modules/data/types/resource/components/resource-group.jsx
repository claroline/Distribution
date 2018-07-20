import React from 'react'
import {connect} from 'react-redux'

import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {trans} from '#/main/core/translation'
import {FormGroup as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_RESOURCE_EXPLORER} from '#/main/core/resource/modals/explorer'

const ResourceGroupComponent = props =>
  <FormGroup
    {...props}
    error={props.error && typeof props.error === 'string' ? props.error : undefined}
    className="resource-group"
  >
    <div className="input-group">
      <input
        id={props.id}
        type="text"
        className="form-control"
        value={props.value || ''}
        disabled={true}
      />
      <div className="input-group-btn">
        <button
          className="btn btn-default"
          type="button"
          onClick={() => props.pickResource(props.pickerTitle, props.pickerCurrent, props.onChange)}
        >
          <span className="fa fa-fw fa-folder" />
        </button>
      </div>
    </div>
  </FormGroup>

implementPropTypes(ResourceGroupComponent, FormGroupWithFieldTypes, {
  value: T.shape({
    id: T.string,
    name: T.string
  }),
  pickerTitle: T.string.isRequired,
  error: T.oneOfType([T.string, T.object]),
  pickResource: T.func.isRequired
}, {
  value: null,
  pickerTitle: trans('resource_picker'),
  pickerCurrent: null
})

const ResourceGroup = connect(
  null,
  dispatch => ({
    pickResource(title, current, onChange) {
      dispatch(modalActions.showModal(MODAL_RESOURCE_EXPLORER, {
        title: title,
        current: current,
        autoClose: false,
        selectAction: (selected) => ({
          type: 'callback',
          callback: () => onChange(selected[0])
        })
      }))
    }
  })
)(ResourceGroupComponent)

export {
  ResourceGroup
}
