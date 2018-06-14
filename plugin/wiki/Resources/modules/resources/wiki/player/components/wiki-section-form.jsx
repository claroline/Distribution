import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

const WikiSectionForm = props =>
  <FormContainer
    level={3}
    name="sections.currentSection"
    sections={[
      {
        icon: 'fa fa-fw fa-cog',
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'activeContribution.title',
            type: 'string',
            label: trans('title'),
            required: true
          }, {
            name: 'activeContribution.text',
            type: 'html',
            label: trans('text'),
            required: true,
            options: {
              min: 1
            }
          }
        ]
      }
    ]}
  >
    <div className="text-center">
      <Button
        id="wiki-section-save-btn"
        type="callback"
        className="btn"
        primary={true}
        callback={() => props.saveChanges()}
        label={trans(props.isNew ? 'create' : 'save')}
        title={trans(props.isNew ? 'create' : 'save')}
      />

      <Button
        id="wiki-section-save-btn"
        type="callback"
        className="btn"
        callback={() => props.cancelChanges()}
        label={trans('cancel')}
        title={trans('cancel')}
      />
    </div>
  </FormContainer>

WikiSectionForm.propTypes = {
  cancelChanges: T.func.isRequired,
  saveChanges: T.func.isRequired,
  isNew: T.bool.isRequired
}

export {
  WikiSectionForm
}

  