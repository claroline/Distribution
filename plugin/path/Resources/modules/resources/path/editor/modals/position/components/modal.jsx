import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {Modal} from '#/main/app/overlay/modal/components/modal'
import {FormData} from '#/main/app/content/form/containers/data'

import {selectors} from '#/plugin/path/resources/path/editor/modals/position/store/selectors'

const PositionModal = props => {
  console.log(props.steps)
  console.log(props.step)

  const selectAction = props.selectAction(props.positionData)

  return (
    <Modal
      {...omit(props, 'step', 'steps', 'positionData', 'selectEnabled', 'selectAction')}
      subtitle={props.step.title}
    >
      <FormData
        name={selectors.STORE_NAME}
        sections={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 't',
                label: trans('position'),
                type: 'choice',
                required: true,
                options: {
                  condensed: true,
                  noEmpty: true,
                  choices: {
                    before: trans('before'),
                    after: trans('after')
                  }
                }
              }, {
                name: 'step',
                label: trans('step', {}, 'path'),
                type: 'choice',
                required: true,
                hideLabel: true,
                options: {
                  condensed: true,
                  noEmpty: true,
                  choices: props.steps
                    .filter(step => step.id !== props.step.id)
                    .reduce((stepChoices, current) => Object.assign(stepChoices, {
                      [current.id]: current.title
                    }), {})
                }
              }
            ]
          }
        ]}
      />

      <Button
        label={trans('select', {}, 'actions')}
        {...selectAction}
        className="modal-btn btn"
        primary={true}
        disabled={!props.saveEnabled}
        onClick={props.fadeModal}
      />
    </Modal>
  )
}

PositionModal.propTypes = {
  title: T.string,
  step: T.shape({
    title: T.string.isRequired
  }),
  steps: T.arrayOf(T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  })),
  positionData: T.shape({
    step: T.string
  }),
  selectEnabled: T.bool,
  selectAction: T.func.isRequired, // action generator
  fadeModal: T.func.isRequired
}

PositionModal.defaultProps = {
  steps: [],
  selectEnabled: false
}

export {
  PositionModal
}
