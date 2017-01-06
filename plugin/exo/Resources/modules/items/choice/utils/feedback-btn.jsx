import React, {PropTypes as T} from 'react'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'

export const Feedback = props => {
  if (!props.feedback) return <span className="item-feedback"/>

  const popoverClick = (
    <Popover id={props.id} className="item-feedback">
      {props.feedback}
    </Popover>
  )

  return(
    <OverlayTrigger trigger="click" placement="top" overlay={popoverClick}>
      <i className="feedback-btn fa fa-comments-o"></i>
    </OverlayTrigger>
  )
}

Feedback.propTypes = {
  id: T.string.isRequired,
  feedback: T.string
}
