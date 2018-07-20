import React from 'react'

import {Button} from '#/main/app/action/components/button'

import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {trans} from '#/main/core/translation'
import {FormGroupWithField as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group'
import {MODAL_RESOURCE_EXPLORER} from '#/main/core/resource/modals/explorer'

const ResourceGroup = props =>
  <FormGroup
    {...props}
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
        <Button
          className="btn btn-default"
          type="modal"
          icon="fa fa-fw fa-folder"
          label={trans('select', {}, 'actions')}
          tooltip="left"
          modal={[MODAL_RESOURCE_EXPLORER, {
            title: props.picker.title,
            current: props.picker.current,
            root: props.picker.root,
            selectAction: (selected) => ({
              type: 'callback',
              callback: () => props.onChange(selected[0])
            })
          }]}
        />
      </div>
    </div>
  </FormGroup>

implementPropTypes(ResourceGroup, FormGroupWithFieldTypes, {
  picker: T.shape({
    title: T.string,
    current: T.shape(ResourceNodeTypes.propTypes),
    root: T.shape(ResourceNodeTypes.propTypes)
  })
}, {
  value: null,
  picker: {
    title: trans('resource_picker'),
    current: null,
    root: null
  }
})

export {
  ResourceGroup
}
