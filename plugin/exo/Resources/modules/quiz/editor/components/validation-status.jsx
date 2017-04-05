import React, {PropTypes as T} from 'react'
import {tex} from '#/main/core/translation'
import {TooltipElement} from './../../../components/form/tooltip-element.jsx'

export const ValidationStatus = props =>
  <TooltipElement
    id={props.id}
    position={props.position}
    tip={tex(props.validating ?
      'editor_validating_desc' :
      'editor_not_validating_desc'
    )}
  >
    <span className={props.validating ?
      'validation-status text-danger fa fa-fw fa-warning' :
      'validation-status text-warning fa fa-fw fa-clock-o'
    }/>
  </TooltipElement>

ValidationStatus.propTypes = {
  id: T.string.isRequired,
  validating: T.bool.isRequired,
  position: T.oneOf(['left', 'top', 'right', 'bottom'])
}

ValidationStatus.defaultProps = {
  position: 'right'
}
